#!/bin/bash

# Vercel Account Switcher for DayinUP / LQ Tech
# Usage: ./scripts/switch-vercel.sh [dayinup|lqtech]

COMPANY=$1

# Replace these with your actual Vercel tokens or set them as environment variables
DAYINUP_TOKEN=${VERCEL_DAYINUP_TOKEN:-"YOUR_TOKEN_HERE"}
LQ_TECH_TOKEN=${VERCEL_LQTECH_TOKEN:-"YOUR_TOKEN_HERE"}

if [ "$COMPANY" == "dayinup" ]; then
    echo "🔄 Switching to DayinUP Vercel Account..."
    rm -rf .vercel
    npx vercel link --yes --project dayinup-dashboard --token $DAYINUP_TOKEN
    echo "✅ Switched to DayinUP. You can now run 'npx vercel --prod --token $DAYINUP_TOKEN'"

elif [ "$COMPANY" == "lqtech" ]; then
    echo "🔄 Switching to LQ Tech Vercel Account..."
    if [ "$LQ_TECH_TOKEN" == "REPLACE_WITH_LQ_TECH_TOKEN" ]; then
        echo "❌ Error: LQ Tech Token not set in script."
        exit 1
    fi
    rm -rf .vercel
    npx vercel link --yes --project dayinup-dashboard --token $LQ_TECH_TOKEN
    echo "✅ Switched to LQ Tech. You can now run 'npx vercel --prod --token $LQ_TECH_TOKEN'"

else
    echo "Usage: ./scripts/switch-vercel.sh [dayinup|lqtech]"
fi
