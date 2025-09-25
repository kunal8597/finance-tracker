#!/usr/bin/env python3
"""
Smart Expense Analysis and Suggestions Script

This script analyzes expense data and provides intelligent spending suggestions.
It reads expense data from a JSON file and outputs suggestions in JSON format.

Usage:
    python expense_suggestions.py <expense_data.json>
"""

import json
import sys
from datetime import datetime, timedelta
from collections import defaultdict, Counter
from typing import Dict, List, Any, Tuple


class ExpenseAnalyzer:
    def __init__(self, expenses: List[Dict[str, Any]]):
        self.expenses = expenses
        self.suggestions = []
        
    def analyze_spending_patterns(self) -> Dict[str, Any]:
        """Analyze spending patterns and return insights"""
        if not self.expenses:
            return {"total_spent": 0, "category_totals": {}, "daily_avg": 0}
        
        # Calculate totals
        total_spent = sum(expense.get('amount', 0) for expense in self.expenses)
        
        # Category breakdown
        category_totals = defaultdict(float)
        for expense in self.expenses:
            category = expense.get('category', 'Other')
            amount = expense.get('amount', 0)
            category_totals[category] += amount
        
        # Calculate daily average (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_expenses = []
        
        for expense in self.expenses:
            try:
                expense_date = datetime.fromisoformat(expense.get('date', ''))
                if expense_date >= thirty_days_ago:
                    recent_expenses.append(expense)
            except (ValueError, TypeError):
                continue
        
        daily_avg = sum(e.get('amount', 0) for e in recent_expenses) / 30 if recent_expenses else 0
        
        return {
            "total_spent": total_spent,
            "category_totals": dict(category_totals),
            "daily_avg": daily_avg,
            "recent_expenses_count": len(recent_expenses)
        }
    
    def generate_category_suggestions(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate suggestions based on category spending"""
        suggestions = []
        category_totals = analysis["category_totals"]
        total_spent = analysis["total_spent"]
        
        if total_spent == 0:
            return ["Start tracking your expenses to get personalized suggestions!"]
        
        # Find top spending category
        if category_totals:
            top_category = max(category_totals, key=category_totals.get)
            top_percentage = (category_totals[top_category] / total_spent) * 100
            
            if top_percentage > 40:
                reduction_amount = category_totals[top_category] * 0.15
                suggestions.append(
                    f"You're spending a lot on {top_category} ({top_percentage:.1f}% of total). "
                    f"Try to reduce it by ₹{reduction_amount:.0f} (15%)."
                )
            
            # Check for unusual category increases
            if top_category == "Food" and top_percentage > 35:
                suggestions.append(
                    "Consider meal planning and cooking at home more often to reduce food expenses."
                )
            elif top_category == "Shopping" and top_percentage > 25:
                suggestions.append(
                    "Review your shopping habits. Consider waiting 24 hours before making non-essential purchases."
                )
            elif top_category == "Entertainment" and top_percentage > 20:
                suggestions.append(
                    "Look for free or low-cost entertainment options like parks, free events, or streaming services."
                )
        
        return suggestions
    
    def generate_pattern_suggestions(self, analysis: Dict[str, Any]) -> List[str]:
        """Generate suggestions based on spending patterns"""
        suggestions = []
        
        # Daily spending analysis
        daily_avg = analysis["daily_avg"]
        if daily_avg > 1000:  # High daily average
            suggestions.append(
                f"Your daily spending average is ₹{daily_avg:.0f}. "
                f"Try to reduce daily expenses by ₹{daily_avg * 0.2:.0f} to improve your budget."
            )
        
        # Recent activity analysis
        recent_count = analysis["recent_expenses_count"]
        if recent_count > 60:  # Very frequent spending
            suggestions.append(
                "You have many small transactions. Consider consolidating purchases to reduce impulse spending."
            )
        elif recent_count < 10:  # Very few transactions
            suggestions.append(
                "Great job keeping your expenses minimal! Consider setting aside the savings for future goals."
            )
        
        return suggestions
    
    def generate_payment_method_suggestions(self) -> List[str]:
        """Generate suggestions based on payment methods"""
        suggestions = []
        
        # Count payment methods
        payment_methods = Counter(expense.get('payment_method', 'Other') for expense in self.expenses)
        
        if not payment_methods:
            return []
        
        # Check for cash usage
        cash_count = payment_methods.get('Cash', 0)
        total_transactions = sum(payment_methods.values())
        
        if cash_count / total_transactions > 0.5:
            suggestions.append(
                "You use cash frequently. Consider using digital payments for better expense tracking and rewards."
            )
        
        # Check for credit card usage
        cc_count = payment_methods.get('Credit Card', 0)
        if cc_count / total_transactions > 0.7:
            suggestions.append(
                "High credit card usage detected. Make sure to pay your credit card bills on time to avoid interest charges."
            )
        
        return suggestions
    
    def generate_general_suggestions(self) -> List[str]:
        """Generate general financial suggestions"""
        suggestions = [
            "Set up automatic transfers to savings to build an emergency fund.",
            "Review and compare prices before making major purchases.",
            "Consider using budgeting apps to track your spending in real-time.",
            "Look for subscription services you're not using and cancel them.",
            "Try the 50/30/20 rule: 50% needs, 30% wants, 20% savings."
        ]
        
        # Return a random selection of general suggestions
        import random
        return random.sample(suggestions, min(2, len(suggestions)))
    
    def generate_all_suggestions(self) -> List[str]:
        """Generate comprehensive suggestions"""
        analysis = self.analyze_spending_patterns()
        
        all_suggestions = []
        all_suggestions.extend(self.generate_category_suggestions(analysis))
        all_suggestions.extend(self.generate_pattern_suggestions(analysis))
        all_suggestions.extend(self.generate_payment_method_suggestions())
        
        # If no specific suggestions, add general ones
        if not all_suggestions:
            all_suggestions.extend(self.generate_general_suggestions())
        
        return all_suggestions[:5]  # Limit to 5 suggestions


def main():
    """Main function to run the expense analysis"""
    if len(sys.argv) != 2:
        print("Usage: python expense_suggestions.py <expense_data.json>", file=sys.stderr)
        sys.exit(1)
    
    input_file = sys.argv[1]
    
    try:
        # Read expense data
        with open(input_file, 'r') as f:
            data = json.load(f)
        
        expenses = data.get('expenses', [])
        
        # Analyze and generate suggestions
        analyzer = ExpenseAnalyzer(expenses)
        suggestions = analyzer.generate_all_suggestions()
        analysis = analyzer.analyze_spending_patterns()
        
        # Output results
        result = {
            "suggestions": suggestions,
            "analysis": {
                "total_spent": analysis["total_spent"],
                "category_breakdown": analysis["category_totals"],
                "daily_average": analysis["daily_avg"],
                "recent_expenses": analysis["recent_expenses_count"]
            },
            "timestamp": datetime.now().isoformat()
        }
        
        print(json.dumps(result, indent=2))
        
    except FileNotFoundError:
        print(f"Error: Could not find file {input_file}", file=sys.stderr)
        sys.exit(1)
    except json.JSONDecodeError:
        print(f"Error: Invalid JSON in file {input_file}", file=sys.stderr)
        sys.exit(1)
    except Exception as e:
        print(f"Error: {str(e)}", file=sys.stderr)
        sys.exit(1)


if __name__ == "__main__":
    main()