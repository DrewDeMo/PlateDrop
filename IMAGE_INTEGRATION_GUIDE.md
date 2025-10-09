# PlateDrop Image Integration Guide

This document outlines all custom images needed for the PlateDrop fitness deals website and their integration instructions.

## Current Status

### ✅ Completed
- **Hero Feature Image**: `site/public/images/hero/hero_feature.webp` - Integrated and displayed in index.astro line 527
- **Category Images**: Integrated in getCategoryImage() function (index.astro lines 33-45)
  - `categories/powerrack.webp` - ✅ Available and integrated
  - `categories/bench.webp` - ✅ Available and integrated
  - `categories/cardio.webp` - ✅ Available and integrated
  - `categories/dumbbell.webp` - ✅ Available and integrated (also used as fallback for barbells and accessories)
- **Feature Images**: Available but not yet integrated in UI
  - `feature/home-gym-wide.webp` - ✅ Available
  - `feature/equipment-detail-1.webp` - ✅ Available
  - `feature/equipment-detail-2.webp` - ✅ Available
  - `feature/equipment-detail-3.webp` - ✅ Available
- **Background Textures**: Available but not yet integrated in CSS
  - `backgrounds/barbell-pattern.webp` - ✅ Available
  - `backgrounds/rack-pattern.webp` - ✅ Available
  - `backgrounds/gym-floor-texture.webp` - ✅ Available
  - `backgrounds/metal-texture.webp` - ✅ Available
  - `backgrounds/tcltech_detailed_realistic_gym_equipment_for_a_background_fea_040e10d5-1652-42b1-b7a4-4186da5feb82_3.webp` - ✅ Available

### ⚠️ Missing Images (Using Fallbacks)
- `categories/barbell.webp` - Currently using dumbbell.webp as fallback
- `categories/plates.webp` - Currently using powerrack.webp as fallback

### 📋 Not Yet Integrated
- Feature section images (home-gym-wide.webp, equipment-detail-*.webp)
- Background texture overlays in CSS
- Trust badge icons (not yet created)

## Directory Structure

```
site/public/images/
├── hero/
│   ├── hero_feature.webp ✅
│   └── hero_background.webp (optional)
├── categories/
│   ├── power-rack.webp
│   ├── barbell.webp
│   ├── plates.webp
│   ├── dumbbells.webp
│   ├── bench.webp
│   └── cardio.webp
├── features/
│   ├── home-gym-wide.webp
│   ├── equipment-detail-1.webp
│   ├── equipment-detail-2.webp
│   └── equipment-detail-3.webp
├── backgrounds/
│   ├── barbell-pattern.webp
│   ├── plate-pattern.webp
│   ├── rack-pattern.webp
│   ├── gym-floor-texture.webp
│   └── metal-texture.webp
└── icons/
    ├── verified-badge.png
    ├── 24-7-badge.png
    ├── quality-badge.png
    └── daily-badge.png
```

---

## Images to Generate

### 1. Hero Section Images

#### Hero Feature Image ✅ COMPLETED
- **File**: `hero_feature.webp`
- **Location**: `site/public/images/hero/`
- **Dimensions**: 800x550px (to match hero height)
- **Description**: Athletic person in workout pose with gym equipment
- **Style**: Professional, cutout/transparent background, dynamic pose
- **Current Status**: Integrated in `index.astro` line 526

#### Hero Background (Optional)
- **File**: `hero_background.webp`
- **Location**: `site/public/images/hero/`
- **Dimensions**: 1920x1080px
- **Description**: Blurred gym equipment montage for subtle background texture
- **Style**: Dark, moody, heavily blurred, low opacity
- **Prompt**: "Abstract blurred gym equipment montage, dark moody atmosphere, barbells and weight plates, professional photography, background texture"

---

### 2. Category Section Images

These images will replace the Unsplash URLs in `index.astro` lines 33-44.

#### Power Rack
- **File**: `power-rack.webp`
- **Location**: `site/public/images/categories/`
- **Dimensions**: 800x600px
- **Prompt**: "Professional power rack squat cage in home gym, dramatic spotlight lighting, dark background, commercial product photography, high quality"

#### Barbell
- **File**: `barbell.webp`
- **Location**: `site/public/images/categories/`
- **Dimensions**: 800x600px
- **Prompt**: "Olympic barbell with loaded bumper plates, close-up knurling detail, dramatic side lighting, shallow depth of field, professional equipment photography"

#### Weight Plates
- **File**: `plates.webp`
- **Location**: `site/public/images/categories/`
- **Dimensions**: 800x600px
- **Prompt**: "Stack of weight plates bumper plates, organized arrangement, clean professional lighting, commercial product photography"

#### Dumbbells
- **File**: `dumbbells.webp`
- **Location**: `site/public/images/categories/`
- **Dimensions**: 800x600px
- **Prompt**: "Set of dumbbells arranged on rack, various weights visible, symmetrical composition, clean lighting, professional gym equipment photography"

#### Bench
- **File**: `bench.webp`
- **Location**: `site/public/images/categories/`
- **Dimensions**: 800x600px
- **Prompt**: "Quality adjustable workout bench in home gym, clean professional lighting, showing adjustability features, commercial product photography"

#### Cardio Equipment
- **File**: `cardio.webp`
- **Location**: `site/public/images/categories/`
- **Dimensions**: 800x600px
- **Prompt**: "Modern rowing machine or assault bike, dynamic sleek modern aesthetic, professional gym equipment photography"

---

### 3. Features Section Images

#### Home Gym Wide Shot
- **File**: `home-gym-wide.webp`
- **Location**: `site/public/images/features/`
- **Dimensions**: 1200x800px
- **Prompt**: "Well-organized home gym with multiple equipment pieces, natural lighting, aspirational but achievable, clean organized space, professional interior photography"

#### Equipment Detail Shots (Set of 3)
- **Files**: `equipment-detail-1.webp`, `equipment-detail-2.webp`, `equipment-detail-3.webp`
- **Location**: `site/public/images/features/`
- **Dimensions**: 400x400px each
- **Prompts**:
  1. "Macro close-up of barbell knurling texture, dramatic lighting, professional product photography"
  2. "Macro close-up of weight plate surface texture and branding, dramatic lighting, professional product photography"
  3. "Macro close-up of power rack welds and steel construction, dramatic lighting, professional product photography"

---

### 4. Background Elements & Textures

#### Abstract Patterns (Set of 3)
- **Files**: `barbell-pattern.webp`, `plate-pattern.webp`, `rack-pattern.webp`
- **Location**: `site/public/images/backgrounds/`
- **Dimensions**: 1920x1080px each
- **Prompts**:
  1. "Abstract blurred barbell pattern with parallel lines, heavily blurred, low opacity, dark background, seamless texture"
  2. "Abstract circular weight plate pattern, heavily blurred, low opacity, dark background, seamless texture"
  3. "Abstract geometric power rack grid pattern, heavily blurred, low opacity, dark background, seamless texture"

#### Texture Overlays (Set of 2)
- **Files**: `gym-floor-texture.webp`, `metal-texture.webp`
- **Location**: `site/public/images/backgrounds/`
- **Dimensions**: 512x512px (tileable)
- **Prompts**:
  1. "Seamless rubber gym floor texture, close-up, tileable pattern, professional photography, high resolution"
  2. "Seamless brushed steel metal texture, tileable pattern, professional photography, high resolution"

---

### 5. Trust Badges / Icons

#### Badge Set (4 icons)
- **Files**: `verified-badge.png`, `24-7-badge.png`, `quality-badge.png`, `daily-badge.png`
- **Location**: `site/public/images/icons/`
- **Dimensions**: 200x200px each (PNG with transparency)
- **Prompts**:
  1. "Modern flat design badge with verified checkmark and gym equipment icon, subtle 3D effects, professional icon design, transparent background"
  2. "24/7 clock icon with monitoring theme, modern flat design, subtle 3D effects, professional icon design, transparent background"
  3. "Shield with quality guarantee symbol and star, modern flat design, subtle 3D effects, professional icon design, transparent background"
  4. "Daily update calendar icon with refresh symbol, modern flat design, subtle 3D effects, professional icon design, transparent background"

---

## Integration Instructions

### Step 1: Generate Images
Use the prompts above with your AI image generator (Midjourney, DALL-E, Stable Diffusion, etc.)

### Step 2: Save to Correct Locations
Place each generated image in its designated folder within `site/public/images/`

### Step 3: Update Code References

#### For Category Images (index.astro lines 33-44):
```javascript
function getCategoryImage(category: string): string {
  const imageMap: Record<string, string> = {
    'cardio': '/images/categories/cardio.webp',
    'racks': '/images/categories/power-rack.webp',
    'dumbbells': '/images/categories/dumbbells.webp',
    'barbells': '/images/categories/barbell.webp',
    'benches': '/images/categories/bench.webp',
    'plates': '/images/categories/plates.webp',
    'accessories': '/images/categories/dumbbells.webp'
  };
  
  return imageMap[category] || '/images/categories/power-rack.webp';
}
```

#### For Background Textures:
Add to CSS sections where backgrounds are needed:
```css
background-image: url('/images/backgrounds/barbell-pattern.webp');
```

#### For Feature Images:
Add to relevant sections in HTML:
```html
<img src="/images/features/home-gym-wide.webp" alt="Home gym setup" />
```

---

## Image Optimization Tips

1. **Format**: Use WebP for photos, PNG for icons with transparency
2. **Compression**: Compress images before uploading (TinyPNG, Squoosh)
3. **Target Sizes**:
   - Hero images: < 500KB
   - Category images: < 200KB
   - Icons: < 50KB
   - Textures: < 100KB

---

## Quick Reference: File Checklist

### Priority 1 (Most Visible)
- [ ] `categories/power-rack.webp`
- [ ] `categories/barbell.webp`
- [ ] `categories/plates.webp`
- [ ] `categories/dumbbells.webp`
- [ ] `categories/bench.webp`
- [ ] `categories/cardio.webp`

### Priority 2 (Enhancement)
- [ ] `features/home-gym-wide.webp`
- [ ] `features/equipment-detail-1.webp`
- [ ] `features/equipment-detail-2.webp`
- [ ] `features/equipment-detail-3.webp`

### Priority 3 (Polish)
- [ ] `backgrounds/barbell-pattern.webp`
- [ ] `backgrounds/plate-pattern.webp`
- [ ] `backgrounds/rack-pattern.webp`
- [ ] `backgrounds/gym-floor-texture.webp`
- [ ] `backgrounds/metal-texture.webp`
- [ ] `icons/verified-badge.png`
- [ ] `icons/24-7-badge.png`
- [ ] `icons/quality-badge.png`
- [ ] `icons/daily-badge.png`

---

## Notes

- All paths are relative to `site/public/` directory
- Images in `public/` are served at root level (e.g., `/images/hero/hero_feature.webp`)
- Hero section currently uses 550px height - images should be optimized for this
- Current hero image positioning: `center right` with `auto 100%` sizing
- Maintain consistent style across all images for brand cohesion
