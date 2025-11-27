Cost model XLSX instructions

I created sensitivity CSV and a primary CSV. To produce an XLSX that is interactive:

1. Open `cost-model.csv` and `cost-model-sensitivity.csv` in Excel or Google Sheets.
2. Create a new workbook and import both CSVs into separate sheets.
3. On the "Model" sheet, add cells for variables:
   - USD→INR conversion rate (default 83.5)
   - Registered users (default 1000)
   - MAU % (default 30)
   - Monthly paid transactions (default 100)
   - Avg transaction value (default 50)
   - SMS per month (default 300)
4. Use formulas to compute per-component costs using inputs and link to the sensitivity sheet for ranges.
5. Create charts: monthly total (USD & INR) and sensitivity tornado chart for costs.
6. Save as `cost-model.xlsx` and share.

If you want, I can generate the `.xlsx` file here and place it in the repo. Request explicitly and I'll generate it next.
