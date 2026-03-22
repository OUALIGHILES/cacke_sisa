# SISA_Cake Messaging Feature Setup

## Overview
This feature allows customers to discuss cake details with the admin directly from the cake details page. Messages are stored in Supabase and can be managed from the admin panel.

## Database Setup

### Step 1: Run the SQL Schema
1. Go to your Supabase dashboard: https://supabase.com/dashboard
2. Select your project
3. Go to **SQL Editor** (in the left sidebar)
4. Click **New Query**
5. Copy and paste the contents of `supabase-schema.sql` file
6. Click **Run** to execute the SQL

The schema creates:
- `messages` table with all necessary fields
- Indexes for faster queries
- Row Level Security policies

### Step 2: Verify Table Creation
After running the SQL, verify the table was created:
1. Go to **Table Editor** in Supabase dashboard
2. You should see the `messages` table listed
3. Click on it to view the columns

## Features

### For Customers:
1. **Cake Details Page**: 
   - See message count for each cake
   - "Start Discussion" or "Continue Discussion" button
   - "View Messages" button if messages exist

2. **Message Page** (`/messages/[cakeId]`):
   - Chat interface with admin
   - View all messages about the specific cake
   - Send new messages
   - User contact info is saved for future messages

### For Admins:
1. **Admin Messages Page** (`/admin/messages`):
   - View all customer messages
   - Messages grouped by cake and customer
   - See customer contact information
   - Reply directly from admin panel
   - Reply via WhatsApp
   - Delete messages
   - Search functionality

## How It Works

### Customer Flow:
1. Customer views a cake in the gallery
2. Clicks on cake to see details
3. Scrolls to "Discussion about this Cake" section
4. Clicks "Start Discussion" or "Send Message"
5. Enters contact info (name, phone, email)
6. Sends message about the cake
7. Can return anytime to view the conversation

### Admin Flow:
1. Admin goes to `/admin/messages`
2. Sees all messages grouped by cake and customer
3. Clicks on a message to view full conversation
4. Can reply directly (saved in database)
5. Can reply via WhatsApp (opens WhatsApp)
6. Can delete messages if needed

## File Structure

```
app/
├── messages/
│   └── [cakeId]/
│       └── page.tsx          # Customer message page
├── admin/
│   └── messages/
│       └── page.tsx          # Admin messages dashboard
components/
└── cake-details.tsx          # Updated with discussion section
lib/
└── supabase.ts               # Supabase client
supabase-schema.sql           # Database schema
```

## Environment Variables

Make sure your `.env.local` file has:

```env
NEXT_PUBLIC_SUPABASE_URL=your-supabase-url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-supabase-anon-key
```

## Testing

### Test as Customer:
1. Run the dev server: `pnpm dev`
2. Go to http://localhost:3000
3. Click on any cake in the gallery
4. Scroll to "Discussion about this Cake" section
5. Click "Start Discussion"
6. Enter your contact info
7. Send a test message

### Test as Admin:
1. Go to http://localhost:3000/admin/messages
2. You should see the message you just sent
3. Click on the message to view details
4. Try sending a reply
5. Go back to the customer view to see the reply

## Troubleshooting

### Error: "relation 'messages' does not exist"
- Run the SQL schema in Supabase SQL Editor

### Error: "permission denied"
- Check that Row Level Security policies are correctly set
- Verify the anon key in `.env.local` is correct

### Messages not loading
- Check browser console for errors
- Verify Supabase URL and key are correct
- Check that the table exists in Supabase

## Customization

### Change WhatsApp Number
Edit the WhatsApp number in:
- `components/cake-details.tsx` (line ~109)
- `app/admin/messages/page.tsx` (line ~93)

### Styling
All components use the existing design system:
- Tailwind CSS
- Shadcn/ui components
- Custom luxury bakery theme (pink, white, gold)

## Security Notes

Currently, the database policies allow anyone to read/write messages. For production, consider:
1. Adding user authentication
2. Restricting admin actions to authenticated admins only
3. Adding rate limiting for message sending
4. Validating message content to prevent spam
