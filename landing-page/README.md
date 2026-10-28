# Landing page: Google Form setup

1. Create a Google Form with two questions:
   - Short answer: **Corporate Email Address**
   - Dropdown: **Primary Infrastructure Framework** (use the same four options as the page)
2. Click **Send → link icon**, copy the link, and open it. The URL looks like
   `https://docs.google.com/forms/d/e/<FORM_ID>/viewform`.
3. Find the entry IDs: on the form page, right-click → **View page source**, search for `entry.`.
   You'll see one `entry.<number>` per question, in order. (Or use **⋮ → Get pre-filled link**,
   fill both fields with dummy values, and read the IDs from the generated URL.)
4. Edit `GOOGLE_FORM` at the bottom of `simulator.js`:
   - `action`: replace `YOUR_FORM_ID` with `<FORM_ID>` (keep `/formResponse` at the end)
   - `fields.email` / `fields.framework`: paste the two entry IDs
5. In the form's **Responses** tab, link a Google Sheet and enable email notifications if you want alerts.

Notes:
- Don't turn on "Limit to 1 response" or require sign-in, or anonymous submissions will fail.
- The form must contain only the fields you send; required questions you don't send will reject the submission.
- Because of `no-cors`, the browser can't see Google's reply, so the page shows success once the request is sent. Test with a real submission and confirm it lands in the Responses tab.
