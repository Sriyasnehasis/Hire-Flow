# 🎨 Frontend UI Visual Reference

**Date:** April 12, 2026 | **Status:** ✅ Production Ready

This guide shows exactly what you'll see when running the site.

---

## 🖥️ Page-by-Page Visual Breakdown

### Homepage / Dashboard

```
╔═══════════════════════════════════════════════════╗
║ 🔵 EXTRACT RESUME                        ⚙️ 👤 │  ← Top Navigation
╠═══════════════════════════════════════════════════╣
║ 📌 Dashboard                                      │
║                                                   │
║ Welcome back, [User Name]! 👋                    │
║                                                   │
║ Quick Actions:                                    │
║ ┌──────────────┐  ┌──────────────┐              │
║ │ Build Resume │  │ Check ATS    │              │
║ │ (Blue)       │  │ (Purple)     │              │
║ └──────────────┘  └──────────────┘              │
║                                                   │
║ Recent Resumes:                                   │
║ • Senior Developer Resume    [Edit] [ATS] [DL]  │
║ • Data Scientist Resume      [Edit] [ATS] [DL]  │
║                                                   │
╚═══════════════════════════════════════════════════╝
```

---

### Resume Hub Page (/resume)

```
╔════════════════════════════════════════════════════════╗
║ Resume Management                          [Create New]│
╠════════════════════════════════════════════════════════╣
║                                                        │
║ Upload Resume Section                                 │
║ ┌─────────────────────────────────────────────────┐   │
║ │ 📁 Choose a file or drag here                   │   │
║ │                                                  │   │
║ │ Supported: PDF, DOCX formats                   │   │
║ └─────────────────────────────────────────────────┘   │
║                                                        │
║ ─────────────────────────────────────────────────────  │
║ Your Resumes (2 total)                               │
║ ─────────────────────────────────────────────────────  │
║                                                        │
║ ┌──────────────────────────────────────────────────┐   │
║ │ 📄 Senior Full Stack Developer Resume           │   │
║ │ Uploaded: March 15, 2026                        │   │
║ │ Pages: 1 | Skills: 8                           │   │
║ │ [Edit] [Check ATS] [Export] [Delete]           │   │
║ └──────────────────────────────────────────────────┘   │
║                                                        │
║ ┌──────────────────────────────────────────────────┐   │
║ │ 📄 Data Scientist Resume                         │   │
║ │ Uploaded: March 10, 2026                        │   │
║ │ Pages: 2 | Skills: 12                          │   │
║ │ [Edit] [Check ATS] [Export] [Delete]           │   │
║ └──────────────────────────────────────────────────┘   │
║                                                        │
╚════════════════════════════════════════════════════════╝
```

---

### Resume Builder - Template Selection (/resume-builder)

```
╔════════════════════════════════════════════════════════╗
║ Select a Template to Get Started                      │
╠════════════════════════════════════════════════════════╣
║                                                        │
║  ┌──────────────────────┐  ┌──────────────────────┐   │
║  │     MODERN 🎨        │  │  PROFESSIONAL 💼    │   │
║  │  ┌──────────────┐    │  │  ┌──────────────┐   │   │
║  │  │ Modern Theme │    │  │  │Professional  │   │   │
║  │  │ Clean Layout │    │  │  │Conservative  │   │   │
║  │  │ Great for    │    │  │  │Best for      │   │   │
║  │  │ Tech Roles   │    │  │  │Corporate     │   │   │
║  │  └──────────────┘    │  │  └──────────────┘   │   │
║  │ [Select Template]    │  │ [Select Template]  │   │
║  └──────────────────────┘  └──────────────────────┘   │
║                                                        │
║  ┌──────────────────────┐  ┌──────────────────────┐   │
║  │  CREATIVE 🚀         │  │   MINIMAL ✨         │   │
║  │  ┌──────────────┐    │  │  ┌──────────────┐   │   │
║  │  │Creative      │    │  │  │Minimal       │   │   │
║  │  │Colorful      │    │  │  │Elegant       │   │   │
║  │  │Best for      │    │  │  │Best for      │   │   │
║  │  │Creative Roles│    │  │  │All Roles     │   │   │
║  │  └──────────────┘    │  │  └──────────────┘   │   │
║  │ [Select Template]    │  │ [Select Template]  │   │
║  └──────────────────────┘  └──────────────────────┘   │
║                                                        │
╚════════════════════════════════════════════════════════╝
```

---

### Resume Builder - Form (/resume-builder?template=modern)

```
╔════════════════════════════════════════════════════════╗
║ Build Your Resume - Step 2 of 5 (Skills Tab)         │
╠════════════════════════════════════════════════════════╣
║                                                        │
║ ├─ Basic Info     ← You are here                      │
║ ├─ Skills         ← Current tab                       │
║ ├─ Education                                          │
║ ├─ Experience                                         │
║ └─ Certifications                                     │
║                                                        │
║ ───────────────────────────────────────────────────   │
║                                                        │
║ Add Skills                                            │
║ ┌──────────────────────────────────────────────────┐  │
║ │ Skill name (e.g., Python)              [ADD]   │  │
║ └──────────────────────────────────────────────────┘  │
║                                                        │
║ Your Skills (8):                                      │
║ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │
║ │Python│ │React │ │Docker│ │AWS  │                 │
║ │  ✕   │ │  ✕   │ │  ✕   │ │  ✕  │                 │
║ └──────┘ └──────┘ └──────┘ └──────┘                 │
║                                                        │
║ ┌──────┐ ┌──────┐ ┌──────┐ ┌──────┐                 │
║ │Node  │ │Mongo │ │Redis │ │Postgres│              │
║ │  ✕   │ │  ✕   │ │  ✕   │ │  ✕    │              │
║ └──────┘ └──────┘ └──────┘ └──────┘                 │
║                                                        │
║ ───────────────────────────────────────────────────   │
║ [Back] [Next: Education]                             │
║                                                        │
╚════════════════════════════════════════════════════════╝
```

---

### Resume Editor (/resume-editor?id=1)

```
╔════════════════════════════════════════════════════════╗
║ Edit Resume: Senior Full Stack Developer   [Save All] │
║ Version: 3 • Modified: 5 minutes ago                  │
╠════════════════════════════════════════════════════════╣
║                                                        │
║ [Basic] [Skills] [Education] [Experience] [Projects]  │
║  ___    ___                                            │
║ [Active]                                              │
║                                                        │
║ ─────────────────────────────────────────────────────  │
║ Basic Information                                      │
║                                                        │
║ Title: ___________________________________           │
║ [Senior Full Stack Developer]                        │
║                                                        │
║ Professional Summary:                                 │
║ ┌─────────────────────────────────────────────────┐  │
║ │ Experienced software engineer with 5+ years...  │  │
║ │                                                  │  │
║ │                                           [4/500]  │  │
║ └─────────────────────────────────────────────────┘  │
║                                                        │
║ ─────────────────────────────────────────────────────  │
║ [Back] [Export] [Save Changes]                       │
║                                                        │
╚════════════════════════════════════════════════════════╝
```

---

### ATS Checker Page (/ats-checker?id=1)

```
╔═══════════════════════════════════════════════════════════╗
║ ATS Resume Compatibility Check              [🔄 Refresh] │
║ Analyzing: Senior Full Stack Developer Resume            │
╠═══════════════════════════════════════════════════════════╣
║                                                           │
║              ┌─────────────────────────┐                 │
║              │                         │                 │
║              │    ╭─────────────╮      │                 │
║              │   ╱               ╲     │                 │
║              │  │  Score: 78   │    │  │                 │
║              │  │   "Good"       │    │  │                 │
║              │   ╲               ╱     │                 │
║              │    ╰─────────────╯      │                 │
║              │                         │                 │
║              │  Status: ✅ Optimized  │                 │
║              │                         │                 │
║              └─────────────────────────┘                 │
║                                                           │
║ Quick Checks:                                            │
║ ✅ Has Summary          ✅ Has Education                 │
║ ✅ Contact Info Present ✅ Skills Listed                 │
║ ⚠️  Long Summary        ❌ No LinkedIn URL               │
║                                                           │
║ ─────────────────────────────────────────────────────── │
║ Skills Analysis                                          │
║ ─────────────────────────────────────────────────────── │
║                                                           │
║ MATCHED SKILLS ✓ (6 of 9)  │  MISSING SKILLS ⚠️ (3)    │
║ ─────────────────────────   │  ─────────────────────    │
║ ✓ Python                    │  ⚠️ Kubernetes            │
║ ✓ React                     │  ⚠️ Machine Learning      │
║ ✓ Docker                    │  ⚠️ AWS Lambda            │
║ ✓ PostgreSQL                │  📊 Match: 67%            │
║ ✓ Node.js                   │  🎯 Add More Tech Skills  │
║ ✓ FastAPI                   │                            │
║                             │                            │
║ Match Score: ████████░░ 67%                             │
║                                                           │
║ ─────────────────────────────────────────────────────── │
║ Formatting Analysis                                      │
║ ─────────────────────────────────────────────────────── │
║                                                           │
║ ⚠️ ISSUES FOUND (2):                                    │
║ 🔴 Summary is too long (387 words, ideal: 100-200)     │
║ 🔴 Using uncommon font "Courier New"                    │
║                                                           │
║ 💡 SUGGESTIONS (4):                                     │
║ 💙 Add LinkedIn URL to profile                          │
║ 💙 Use bullet points for better readability            │
║ 💙 Bold key achievements                               │
║ 💙 Add GPA if it's 3.5 or higher                       │
║                                                           │
║ ─────────────────────────────────────────────────────── │
║ [Back to Resumes]  [Edit Resume]  [Export as DOCX]    │
║                                                           │
╚═══════════════════════════════════════════════════════════╝
```

---

### Export Dialog (Modal)

```
        ┌───────────────────────────────────┐
        │ Export Resume                   ✕ │
        ├───────────────────────────────────┤
        │                                   │
        │ Format: Choose how you want to    │
        │         export your resume        │
        │                                   │
        │  [DOCX] [Download DOCX file]     │ ← Active
        │   (Compatible with MS Word)      │
        │                                   │
        │  [PDF] [Coming Soon]             │ ← Disabled
        │   (Professional PDF format)      │
        │                                   │
        │ ───────────────────────────────── │
        │                                   │
        │      [Cancel]   [Download]       │
        │                                   │
        └───────────────────────────────────┘
```

---

## 🎨 Color Codes

### UI Elements

```
Blue (#2563eb)
├─ Primary buttons
├─ Links
├─ Form focus
├─ "Edit" buttons
└─ Headings accent

Purple (#7c3aed)
├─ Secondary accent
├─ "Check ATS" buttons
├─ Badge backgrounds
└─ Hover effects

Orange (#ea580c)
├─ "Export" buttons
├─ "Download" buttons
├─ Warning highlights
└─ Call-to-action

Green (#10b981)
├─ Success messages
├─ Matched skills
├─ Checkmarks
└─ Approved status

Red (#ef4444)
├─ Error messages
├─ Issues/problems
├─ Missing skills
└─ Delete buttons

Gray (#475569 to #1e293b)
├─ Backgrounds
├─ Disabled states
├─ Secondary text
└─ Borders

White (#f1f5f9)
├─ Text on dark
├─ Card backgrounds
└─ Highlights
```

---

## 📐 Layout Grid

All components follow an 8px base grid:

```
Spacing:    8px, 16px, 24px, 32px
Padding:    8px, 12px, 16px, 24px
Margins:    12px, 16px, 24px, 32px
Border R:   4px, 8px, 12px, 16px
Heights:    32px, 40px, 48px, 56px
Widths:     100%, 90%, 80%, 50%, 33%, etc.
```

---

## 🔲 Button Styles

### Primary Button (Blue)

```
Background: #2563eb
Text:       White (#ffffff)
Padding:    12px 24px
Height:     40px
Hover:      Brightness +10%, Shadow enhance
Active:     Scale 0.98, Darker blue
Disabled:   Opacity 50%, Cursor not-allowed
```

### Secondary Button (Orange/Export)

```
Background: #ea580c
Text:       White (#ffffff)
Padding:    12px 24px
Height:     40px
Hover:      Brightness +10%, Shadow enhance
Active:     Scale 0.98, Darker orange
Icon:       Upload or Download icon
```

### Tertiary Button (Ghost)

```
Background: Transparent
Border:     1px solid #94a3b8
Text:       #e2e8f0
Padding:    12px 24px
Height:     40px
Hover:      Background #1e293b
Active:     Border color brighter
```

---

## 📝 Form Elements

### Input Field

```
Background:  #1e293b
Border:      1px solid #334155
Text:        #f1f5f9
Padding:     12px 16px
Height:      40px
Radius:      8px
Focus:       Border #2563eb, Shadow blue glow
Error:       Border #ef4444, Text red
Success:     Border #10b981, Icon checkmark
```

### Textarea

```
Same as input, but:
Height:      120px minimum
Vertical:    Text align top
Resize:      Vertical only
```

### Checkbox/Radio

```
Size:        20px
Color:       #2563eb (checked)
Border:      #334155 (unchecked)
Radius:      4px (checkbox), 50% (radio)
Focus:       Ring #2563eb 2px
```

---

## 🎬 Animations

### Fade In (200ms)

```css
opacity: 0 → 1
transition: ease-in-out
```

### Slide In (300ms)

```css
transform: translateX(-20px) → 0
opacity: 0 → 1
transition: ease-out
```

### Scale (150ms)

```css
transform: scale(1) → scale(1.05) on hover
transition: ease-in-out
```

### Spin (Loading - infinite)

```css
transform: rotate(0deg) → 360deg
duration: 1s
iteration: infinite
timing: linear
```

### Tab Switch (200ms)

```css
opacity: 0 → 1
transform: translateY(4px) → 0
timing: ease-out
```

---

## 📱 Responsive Breakpoints

### Mobile (< 640px)

```
Layout:     Single column
Buttons:    Full width (except inline actions)
Padding:    16px edges
Font:       16px base (prevent zoom)
Navigation: Hamburger menu
Cards:      Stack vertically
Modals:     Full screen minus margins
```

### Tablet (640px - 1024px)

```
Layout:     2 columns possible
Buttons:    Inline where sensible
Padding:    20px edges
Font:       16px base
Navigation: Sidebar (collapsible)
Cards:      Grid 2 across
Modals:     Modal width (500px)
```

### Desktop (> 1024px)

```
Layout:     Full multi-column
Buttons:    Inline optimized
Padding:    24-32px edges
Font:       14-16px optimized
Navigation: Full sidebar
Cards:      Grid 3+ across
Modals:     Centered (600px max)
```

---

## ♿ Accessibility Features

### Keyboard Navigation

```
TAB         Tab through interactive elements
SHIFT+TAB   Tab backwards
ENTER       Activate buttons/submit forms
SPACE       Toggle checkboxes
ESCAPE      Close modals/dropdowns
ARROW KEYS  Navigate within selects/tabs
```

### Screen Reader Support

```
All buttons have aria-label
All inputs have associated labels
Form errors announced
Loading states described
Modal dialogs have role="dialog"
Headings use proper hierarchy (h1, h2, h3)
```

### Color Contrast

```
Text on background: > 4.5:1 ratio
Button border: > 3:1 ratio
All text foreground: WCAG AA compliant
```

---

## 🎯 Typography Scale

```
H1:  28px Bold   - Page title
H2:  24px Bold   - Section title
H3:  20px Bold   - Subsection
H4:  18px Bold   - Small heading
Body: 14px Regular - Body text
Label: 12px Medium  - Form labels
Small: 12px Regular - Helper text
Tiny:  11px Regular - Metadata
```

---

## 📊 Component Sizes

```
Button (Small):      32px height, 12px padding
Button (Medium):     40px height, 16px padding
Button (Large):      48px height, 24px padding

Input:               40px height, 12px padding
Textarea:            120px+ height, 12px padding

Card:                300px-600px width
Modal:               400px-600px width, centered
Avatar:              32px, 48px, 64px, 96px

Badge:               20px height, 8px padding
Pill:                28px height, 12px padding
Icon:                16px, 20px, 24px, 32px
```

---

## 🌙 Dark Theme (Primary)

```
Background Colors:
Base:       #0f172a  (Slate 900)
Surface:    #1e293b  (Slate 800)
Hover:      #334155  (Slate 700)
Subtle:     #475569  (Slate 600)

Text Colors:
Primary:    #f1f5f9  (Slate 100)
Secondary:  #cbd5e1  (Slate 300)
Tertiary:   #94a3b8  (Slate 400)
Muted:      #64748b  (Slate 500)

Accent Colors:
Blue:       #2563eb
Purple:     #7c3aed
Orange:     #ea580c
Green:      #10b981
Red:        #ef4444
```

---

## 🚀 Performance Optimizations

```
Image Loading:     Lazy loading for cards
Bundle Size:       < 500KB gzipped
Time to Interactive: < 3 seconds
Lighthouse Score: > 90

CSS:               Tailwind purging unused
JavaScript:        Code splitting per page
Fonts:             System fonts (no @import)
Caching:           Browser cache headers
```

---

## ✅ Quality Checklist

When viewing the site:

- [ ] Page loads in < 2 seconds
- [ ] Text is crisp and readable
- [ ] Buttons have clear hover states
- [ ] Icons align properly with text
- [ ] Forms validate in real-time
- [ ] Modals appear centered
- [ ] Loading spinners animate smoothly
- [ ] Mobile view is readable (no horizontal scroll)
- [ ] Dark theme doesn't strain eyes
- [ ] All colors have proper contrast
- [ ] Animations feel smooth (60 FPS)
- [ ] No layout shift as content loads
- [ ] Tabs switch without flicker
- [ ] Export button downloads DOCX
- [ ] Console shows no errors

---

## 🎉 You're Ready to See It!

Your frontend UI is beautifully designed with:

- ✅ Professional dark theme
- ✅ Smooth animations
- ✅ Responsive layout
- ✅ Accessible components
- ✅ Real-time validation
- ✅ Loading states
- ✅ Error handling

**Run the site and experience the fully functional resume ecosystem!**
