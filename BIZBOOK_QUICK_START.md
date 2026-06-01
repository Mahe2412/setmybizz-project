# 🎯 BizBook AI - Quick Reference Guide

## 🚀 Getting Started

### Access BizBook
- **Main Route**: http://localhost:3000/bizbook
- **OS Route**: http://localhost:3000/os/bizbook
- **Dev Server**: Running on http://localhost:3000

### First Steps
1. Create your first invoice
2. Add products to catalog
3. Add customers
4. Log expenses
5. Review AI insights

---

## 📑 Navigation Guide

### 1️⃣ **Dashboard (Home)**
- Quick business snapshot
- Key metrics display
- Quick action buttons
- Smart tools overview

**What to do:**
- View your business summary
- Click Quick Actions to jump to features
- Check profit margin and sales trend

### 2️⃣ **Invoices (Bills)**
- Create GST-ready invoices
- Manage line items
- Calculate taxes automatically
- Track payment status

**How to create invoice:**
1. Select customer (or walk-in)
2. Add items with qty, price, GST%
3. System calculates CGST/SGST or IGST
4. Enter paid amount
5. Save invoice

### 3️⃣ **Products**
- Manage product catalog
- Set selling price
- Track stock levels
- Add HSN codes

**How to add product:**
1. Enter product name
2. Set selling price
3. Set GST percentage
4. Enter stock quantity
5. Click "Add Product"

### 4️⃣ **Customers**
- Maintain customer list
- Track phone & email
- Store GSTIN
- Track state for tax calculation

**How to add customer:**
1. Enter name
2. Add phone number
3. Select state
4. Add GSTIN (optional)
5. Click "Add Customer"

### 5️⃣ **Expenses**
- Log business expenses
- Categorize spending
- Add detailed notes
- Track spending trends

**Categories available:**
- Office
- Travel
- Marketing
- Supplies
- Vendor Payment

### 6️⃣ **AI Insights** ✨
- Generate business analysis
- Get actionable recommendations
- Create payment reminders
- View business health

**Features:**
- **Generate Insights**: Analyze sales, expenses, profits
- **Payment Reminders**: Create follow-up messages
- **Business Health**: Get real-time alerts

### 7️⃣ **Reports**
- View financial summary
- Check outstanding receivables
- Monitor expense burn
- GST compliance readiness
- Inventory alerts

---

## 🎨 UI Features

### Dark Mode
- Toggle with 🌙/☀️ button
- Persists your preference
- Available on all pages

### Responsive Design
- Works on mobile, tablet, desktop
- Bottom navigation on mobile
- Touch-friendly buttons

### Notifications
- Success messages for actions
- Error alerts for issues
- Business health alerts

---

## 💡 AI Features Explained

### 1. Business Insights
**What it does:**
- Analyzes your sales, expenses, profits
- Generates 3-4 key recommendations
- Shows impact (high/medium/low)

**How to use:**
1. Go to AI Insights tab
2. Click "Generate Insights"
3. Read recommendations
4. Implement suggested actions

### 2. Payment Reminders
**What it does:**
- Creates follow-up messages for unpaid invoices
- Suggests timing and tone
- Prioritizes by urgency

**How to use:**
1. Go to AI Insights tab
2. Click "Generate Payment Reminders"
3. Copy messages
4. Send via WhatsApp/Email

### 3. Business Health Checker
**What it does:**
- Scores your business 0-100
- Shows alerts and warnings
- Provides recommendations

**Score meanings:**
- 85-100: Excellent ✅
- 70-85: Good 👍
- 50-70: Fair ⚠️
- <50: Critical 🚨

### 4. Analytics Dashboard
**What it does:**
- Shows 7-day & 30-day trends
- Breaks down expenses by category
- Calculates daily averages
- Shows spending patterns

---

## 🔢 Key Metrics Explained

| Metric | Meaning | Why It Matters |
|--------|---------|-----------------|
| **Total Sales** | Sum of all invoices | Shows revenue |
| **Receivables** | Money owed to you | Shows cash flow risk |
| **Expenses** | Total business spend | Shows cost structure |
| **Profit Margin** | (Sales-Expenses)/Sales | Shows profitability |
| **Overdue Invoices** | Unpaid/partial invoices | Shows collection status |
| **Low Stock Items** | Products with ≤5 units | Shows inventory risk |

---

## ⚡ Quick Tips

### Invoice Shortcuts
- **Auto-numbering**: Leave invoice # blank for auto-number
- **Product lookup**: Click dropdown to select from catalog
- **Auto-calculate**: GST calculated automatically on save
- **Partial payments**: Mark as unpaid, partial, or paid

### Expense Tracking
- **Daily entries**: Log expenses daily for accuracy
- **Categories**: Use consistent categories for better analysis
- **Notes**: Add details for future reference
- **Trends**: Review weekly to spot patterns

### Reports
- **Weekly review**: Check reports every Monday
- **Monthly analysis**: Review full month at month-end
- **AI insights**: Generate insights after major changes
- **Predictions**: Use trends to forecast next month

### Dark Mode
- Works everywhere
- Great for evening work
- Reduces eye strain
- Preference saved

---

## 🐛 Troubleshooting

### Invoice not saving
- Check if items are added
- Verify customer is selected (optional)
- Ensure at least one item has a name

### AI features not working
- Check internet connection
- Ensure GEMINI API key is set
- Verify no API rate limits
- Check browser console for errors

### Dark mode not persisting
- Check browser localStorage
- Ensure cookies are enabled
- Try clearing browser cache
- Switch mode again

### Calculations incorrect
- Verify tax percentages
- Check for discount percentages
- Confirm customer state for tax type
- Review line item quantities

---

## 📊 Sample Data Entry

### Sample Invoice
```
Customer: ABC Enterprises
Items:
- Product A: Qty 5 @ ₹100, GST 18%
- Product B: Qty 2 @ ₹200, GST 5%
Paid Amount: ₹500
Status: Partial
```

### Sample Expense
```
Category: Office
Amount: ₹2,500
Note: Stationery and printer paper
Date: 2026-06-01
```

---

## 🔐 Data Security

- ✅ All data encrypted in Supabase
- ✅ User authentication required
- ✅ No shared access between users
- ✅ Regular backups
- ✅ Compliant security standards

---

## 📞 Support

### Documentation
- See `BIZBOOK_ENHANCEMENT_GUIDE.md`
- See `BIZBOOK_DEVELOPMENT_SUMMARY.md`
- Check component inline comments

### Common Issues
1. **Page not loading**: Restart dev server
2. **Data not saving**: Check Supabase connection
3. **Calculations wrong**: Verify tax rates
4. **Dark mode broken**: Clear localStorage

---

## 🎓 Learning Path

### Day 1: Setup & Basics
1. Create 3-5 products
2. Add 2-3 customers
3. Create first invoice
4. Log 3-4 expenses

### Day 2: Operations
1. Create 5+ invoices
2. Mark some as paid/partial
3. Review expense categories
4. Check dashboard metrics

### Day 3: AI Features
1. Generate business insights
2. Create payment reminders
3. Review business health score
4. Analyze expense breakdown

### Week 1: Advanced
1. Monitor daily trends
2. Review weekly reports
3. Optimize expense categories
4. Plan month-end review

---

## 🚀 Next Steps

1. **Start using it**: Create invoices and track expenses
2. **Add your data**: Build your product and customer database
3. **Review insights**: Use AI insights to optimize
4. **Monitor health**: Check business score regularly
5. **Export data**: Use reports for GST filing

---

**Happy invoicing! 🎉**

*BizBook AI - Transforming small business management*

Last Updated: June 1, 2026
