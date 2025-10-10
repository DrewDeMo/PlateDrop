# Commission References Removed

**Date:** 2025-10-10
**Reason:** Removing all commission-related content until affiliate program approval is obtained.

## Changes Made

### Frontend Components & Pages

1. **site/src/pages/index.astro**
   - Removed affiliate disclosure banner from deals section
   - Removed commission mention from price disclaimer

2. **site/src/components/DealCard.astro**
   - Removed affiliate notice text below deal buttons

3. **site/src/components/home/DealsSection.astro**
   - Removed affiliate disclosure banner
   - Removed commission mention from price disclaimer

4. **site/src/components/Footer.astro**
   - Removed commission mention from footer disclaimer

5. **site/src/pages/faq.astro**
   - Removed entire FAQ question about earning money from deals

6. **site/src/pages/about.astro**
   - Updated transparency section to remove commission reference

### LLM Prompts

7. **llm/prompts/daily-deals.txt**
   - Removed commission mention from price disclaimer template

## What Remains

The following affiliate-related content remains in place as it's informational:

- `/affiliate-disclosure` page (explains future affiliate relationships)
- Links to affiliate disclosure page in footer and other legal pages
- Affiliate link infrastructure (ready for when approved)

## Next Steps

When affiliate program approval is obtained:

1. Restore commission disclosures to components
2. Update FAQ to include commission question
3. Update LLM prompts to include commission disclaimers
4. Verify all affiliate links are properly tagged
5. Test disclosure visibility across all pages

## Files Modified

- site/src/pages/index.astro
- site/src/components/DealCard.astro
- site/src/components/home/DealsSection.astro
- site/src/components/Footer.astro
- site/src/pages/faq.astro
- site/src/pages/about.astro
- llm/prompts/daily-deals.txt
