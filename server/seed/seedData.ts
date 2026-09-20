import bcrypt from 'bcryptjs';

export const initialUsers = [
  {
    id: 'user_admin_1',
    name: 'Eleanor Vance',
    email: 'admin@atelierlux.com',
    passwordHash: bcrypt.hashSync('admin123', 10),
    role: 'admin' as const,
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    title: 'Principal Creative Director',
    wishlist: ['design_1', 'design_3'],
    status: 'active' as const,
    createdAt: '2025-01-15T10:00:00.000Z',
  },
  {
    id: 'user_client_1',
    name: 'Julian Sterling',
    email: 'client@atelierlux.com',
    passwordHash: bcrypt.hashSync('client123', 10),
    role: 'user' as const,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    wishlist: ['design_2', 'design_4', 'design_5'],
    phone: '+1 (555) 234-8901',
    preferences: {
      preferredStyle: 'Scandinavian Japandi',
      propertyType: 'Penthouse Apartment'
    },
    status: 'active' as const,
    createdAt: '2025-02-01T14:30:00.000Z',
  },
  {
    id: 'user_client_2',
    name: 'Sienna Brooks',
    email: 'sienna@example.com',
    passwordHash: bcrypt.hashSync('client123', 10),
    role: 'user' as const,
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    wishlist: ['design_1'],
    phone: '+1 (555) 876-5432',
    preferences: {
      preferredStyle: 'Warm Minimalist',
      propertyType: 'Single Family Villa'
    },
    status: 'active' as const,
    createdAt: '2025-02-18T09:15:00.000Z',
  }
];

export const initialDesigns = [
  {
    id: 'design_1',
    title: 'The Kyoto Villa Residence',
    category: 'Living Room',
    roomType: 'living-room',
    style: 'Scandinavian Japandi',
    images: [
      'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'A serene harmony of Nordic simplicity and Japanese craftsmanship. Features limewash plaster walls, low-profile custom white oak cabinetry, artisanal washi paper lanterns, and tactile linen bouclé upholstery that maximizes organic daylight.',
    tags: ['Minimalist', 'Japandi', 'Linen', 'Oak Wood', 'Calm Living', 'Natural Light'],
    designerId: 'user_admin_1',
    designerName: 'Eleanor Vance',
    areaSqFt: 620,
    yearCompleted: 2024,
    budgetRange: '$45,000 - $65,000',
    featured: true,
    viewCount: 1420,
    createdAt: '2025-01-10T12:00:00.000Z',
    palette: ['#EFECE6', '#C7B299', '#8C7A6B', '#2C2B29'],
    materials: ['Natural White Oak', 'Hand-applied Limewash', 'Belgian Linen', 'Travertine Stone']
  },
  {
    id: 'design_2',
    title: 'Tribeca High-Ceiling Master Suite',
    category: 'Bedroom',
    roomType: 'bedroom',
    style: 'Contemporary Luxury',
    images: [
      'https://images.unsplash.com/photo-1616594039964-ae9021a400a0?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1595526114035-0d45ed16cfbf?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1540518614846-7ede433c4ef0?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'An expansive master suite sanctuary in a historic Manhattan loft. Styled with custom upholstered channeled velvet headboards, integrated architectural cove lighting, bespoke fluted walnut dressers, and silk-wool area rugs.',
    tags: ['Primary Suite', 'Velvet', 'Luxury', 'Loft', 'Fluted Wood', 'Mood Lighting'],
    designerId: 'user_admin_1',
    designerName: 'Eleanor Vance',
    areaSqFt: 540,
    yearCompleted: 2024,
    budgetRange: '$50,000 - $75,000',
    featured: true,
    viewCount: 980,
    createdAt: '2025-01-18T15:00:00.000Z',
    palette: ['#F5F3EF', '#D4CDC5', '#5E524D', '#1A1817'],
    materials: ['Smoked Walnut', 'Mohair Velvet', 'Hand-loomed Silk Wool', 'Brushed Brass']
  },
  {
    id: 'design_3',
    title: 'Monolithic Calacatta Culinary Haven',
    category: 'Kitchen',
    roomType: 'kitchen',
    style: 'Modern Minimalist',
    images: [
      'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1507089947368-19c1da9775ae?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585152220-90363fe7e115?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'A statement kitchen anchored by a seamless 14-foot Calacatta marble waterfall island, concealed pocket doors, Gaggenau induction suites, and matte charcoal oak cabinetry engineered for Michelin-worthy culinary flow.',
    tags: ['Calacatta Marble', 'Waterfall Island', 'Modern Kitchen', 'Integrated Appliances', 'Hidden Storage'],
    designerId: 'user_admin_1',
    designerName: 'Eleanor Vance',
    areaSqFt: 480,
    yearCompleted: 2024,
    budgetRange: '$80,000 - $120,000',
    featured: true,
    viewCount: 1840,
    createdAt: '2025-02-01T11:00:00.000Z',
    palette: ['#FFFFFF', '#E8E8E8', '#888888', '#1F2022'],
    materials: ['Calacatta Marble', 'Matte Lacquer', 'Charcoal Oak', 'Patinated Bronze']
  },
  {
    id: 'design_4',
    title: 'Pacific Heights Executive Library & Atelier',
    category: 'Office',
    roomType: 'office',
    style: 'Mid-Century Modern',
    images: [
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1505373877841-8d25f7d46678?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1586023492125-27b2c045efd7?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Designed for high-focus intellectual work, this private library pairs floor-to-ceiling book matched teak shelving with cognac aniline leather seating, sculptural cast-bronze lighting, and acoustic slat paneling.',
    tags: ['Home Office', 'Teak Shelving', 'Mid-Century', 'Leather', 'Acoustics', 'Ergonomic'],
    designerId: 'user_admin_1',
    designerName: 'Marcus Sterling',
    areaSqFt: 380,
    yearCompleted: 2023,
    budgetRange: '$35,000 - $55,000',
    featured: false,
    viewCount: 760,
    createdAt: '2025-02-10T16:00:00.000Z',
    palette: ['#EBE6DD', '#A87C4F', '#4D3626', '#26211C'],
    materials: ['Warm Teak', 'Aniline Cognac Leather', 'Acoustic Wool Felt', 'Antique Brass']
  },
  {
    id: 'design_5',
    title: 'The Roman Bathhouse Oasis',
    category: 'Bathroom',
    roomType: 'bathroom',
    style: 'Warm Mediterranean',
    images: [
      'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1552321554-5fefe8c9ef14?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1620626011761-996317b8d101?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Inspired by ancient thermal springs, this wellness-centric bathroom incorporates a hand-carved limestone soaking tub, frameless rainfall showers, tadelakt water-resistant plaster walls, and hidden radiant heat floors.',
    tags: ['Spa Bathroom', 'Freestanding Tub', 'Limestone', 'Tadelakt', 'Rain Shower', 'Sanctuary'],
    designerId: 'user_admin_1',
    designerName: 'Sophia Laurent',
    areaSqFt: 290,
    yearCompleted: 2024,
    budgetRange: '$40,000 - $60,000',
    featured: true,
    viewCount: 1150,
    createdAt: '2025-02-14T08:30:00.000Z',
    palette: ['#F7F4EE', '#DFD7C7', '#A39987', '#544F47'],
    materials: ['Dordogne Limestone', 'Waterproof Tadelakt', 'Raw Brass Plumbing', 'Cypress Wood']
  },
  {
    id: 'design_6',
    title: 'Haussmannian Salon & Formal Dining',
    category: 'Dining Room',
    roomType: 'dining-room',
    style: 'Traditional Elegant',
    images: [
      'https://images.unsplash.com/photo-1617806118233-18e1de247200?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600565193348-f74bd3c7ccdf?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600585154526-990dced4db0d?auto=format&fit=crop&w=1600&q=80'
    ],
    description: 'Classic 19th-century Parisian architecture revitalized for contemporary dinners. Restored chevron parquet, ornate boiserie wall paneling, a monumental smoked-oak dining table for twelve, and a hand-blown Murano glass chandelier.',
    tags: ['Formal Dining', 'Chevron Parquet', 'Boiserie', 'Chandelier', 'European Classic'],
    designerId: 'user_admin_1',
    designerName: 'Sophia Laurent',
    areaSqFt: 510,
    yearCompleted: 2023,
    budgetRange: '$55,000 - $85,000',
    featured: false,
    viewCount: 890,
    createdAt: '2025-02-22T13:45:00.000Z',
    palette: ['#FCFAF7', '#E5DDD3', '#948777', '#332E29'],
    materials: ['Aged French Oak', 'Gilded Mirror Finishes', 'Murano Crystal', 'Raw Silk Drapes']
  }
];

export const initialServices = [
  {
    id: 'service_1',
    name: 'Essential Spatial Styling & Curation',
    tier: 'Essential',
    description: 'Designed for homeowners seeking an aesthetic refresh. We provide spatial re-layout, custom furniture curation, color palette master guides, and lighting schemes without architectural demolition.',
    priceRange: '$2,500 – $4,500',
    category: 'Styling',
    deliverables: [
      'Digital 2D Space Layout & Furniture Flow Plan',
      'Curated Furniture & Decor Procurement List',
      'Material & Paint Swatch Board with Codes',
      '2 Rounds of Design Iteration',
      'White-glove styling checklist for delivery'
    ],
    duration: '2 to 3 Weeks',
    popular: false,
  },
  {
    id: 'service_2',
    name: 'Full Room Architectural Transformation',
    tier: 'Signature',
    description: 'Our most sought-after signature service. Complete room overhaul including custom millwork design, 3D photorealistic architectural renders, contractor liaising, and full white-glove installation.',
    priceRange: '$7,500 – $14,000',
    category: 'Full Transformation',
    deliverables: [
      'Comprehensive 3D Photorealistic Architectural Renders',
      'Custom Millwork & Cabinetry Elevation Drawings',
      'Complete Lighting & Electrical Schematic Plans',
      'Direct Trade-Discount Procurement Management',
      'Site Visits & General Contractor Coordination',
      'Final On-site Styling & Accessorizing Day'
    ],
    duration: '6 to 8 Weeks',
    popular: true,
  },
  {
    id: 'service_3',
    name: 'Turnkey Luxury Estate Design',
    tier: 'Estate & Turnkey',
    description: 'End-to-end architectural interior architecture and full estate realization. From raw framing to the last cashmere throw blanket on your armchair, we oversee every square foot with unmatched precision.',
    priceRange: '$25,000 – $60,000+',
    category: 'Estate & Whole Home',
    deliverables: [
      'Multi-Room / Full Residence Master Architectural Plan',
      'Custom Bespoke Furniture Fabrication & Import',
      'Art Advisory & Gallery Curation Services',
      'Smart Home Automation & Architectural Lighting Design',
      'Dedicated Senior Project Manager on Call',
      'Turnkey Handover with Champagne & Welcome Hamper'
    ],
    duration: '3 to 6 Months',
    popular: false,
  }
];

export const initialBlogs = [
  {
    id: 'blog_1',
    title: 'The Art of Quiet Luxury: How Organic Textures Elevate Modern Spaces',
    slug: 'the-art-of-quiet-luxury-organic-textures',
    excerpt: 'Explore how combining limewash plaster, raw travertine, and open-weave linens creates an atmosphere of understated, enduring elegance.',
    content: `
# The Art of Quiet Luxury: How Organic Textures Elevate Modern Spaces

In an era saturated with transient design trends and rapid-fire micro-aesthetics, the world of fine interior architecture is pivoting decisively toward permanence, restraint, and sensory depth. This movement, often coined **Quiet Luxury** or *Organic Modernism*, is less about overt ornamentation and more about the sublime tactile dialogue between light, material, and volume.

## 1. The Power of Textural Juxtaposition

When color palettes are kept deliberately restrained—leaning on stone creams, muted taupes, and oxidized charcoals—texture becomes the primary carrier of emotion.

> "A room without texture is a room without a pulse. When you remove visual clutter, the tactile qualities of linen, rough-hewn stone, and brushed timber must do the heavy lifting."
> — *Eleanor Vance, Principal Creative Director*

Consider pairing a honed Calacatta marble countertop, smooth and icy cool to the fingertips, alongside custom white oak barstools finished with a wire-brushed grain and upholstered in heavy-weight Belgian bouclé. The tension between the reflective stone and the absorbent wool creates an immediate sense of warmth without adding visual noise.

## 2. Limewash and Mineral Plaster Walls

Flat drywall paint absorbs light uniformly, deadening a room's natural atmosphere. In contrast, artisanal limewash and Roman tadelakt plasters allow ambient light to refract across delicate mineral variations. As daylight moves through the space from dawn to dusk, the walls appear alive, whispering subtle shifts in tone and mood.

## 3. Curating Negative Space

One of the greatest luxuries in contemporary residential design is the discipline of restraint. Empty space is not an oversight waiting to be filled with side tables; it is a conscious architectural frame that grants breathing room to singular statement pieces.
    `,
    coverImage: 'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Eleanor Vance',
      role: 'Principal Creative Director',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'
    },
    publishedDate: '2025-01-28',
    tags: ['Quiet Luxury', 'Textures', 'Limewash', 'Architecture'],
    readTimeMinutes: 5
  },
  {
    id: 'blog_2',
    title: 'Designing the Home Sanctuary: Wellness Architecture and Light Flow',
    slug: 'designing-the-home-sanctuary-wellness-architecture',
    excerpt: 'How circadian lighting, natural acoustics, and biophilic proportions transform our private dwellings into restorative health sanctuaries.',
    content: `
# Designing the Home Sanctuary: Wellness Architecture and Light Flow

As our dwellings increasingly double as offices, retreats, and creative studios, the impact of physical environment on neurobiology and nervous system regulation has moved to center stage.

## Circadian Rhythm Integration

Human biology evolved under dynamic celestial light: warm and low at sunrise, crisp and blue-spectrum at midday, and amber-rich as dusk descends. In our recent residential projects, we engineer multi-tier architectural lighting schemes that mirror this natural progression automatically.

### Key Considerations for Restorative Lighting:
- **Concealed Cove Lighting**: Bouncing light off matte ceilings softens shadows.
- **Low-Level Sconces**: Mounted at eye level or lower for calming evening wind-downs.
- **High CRI Fixtures**: Fixtures with a Color Rendering Index exceeding 95 ensure true-to-life tones.

## Biophilic Proportions & Acoustic Comfort

Sound carries stress. Hard reflective surfaces—polished tile, bare glass, concrete—generate acoustic flutter that subtly elevates cortisol levels. By introducing acoustic timber ceiling slats, dense mohair drapes, and plush wool floor coverings, spaces immediately become acoustically enveloping and restful.
    `,
    coverImage: 'https://images.unsplash.com/photo-1618221195710-dd6b41faaea6?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Sophia Laurent',
      role: 'Senior Architectural Designer',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80'
    },
    publishedDate: '2025-02-12',
    tags: ['Wellness', 'Lighting', 'Acoustics', 'Sanctuary'],
    readTimeMinutes: 6
  },
  {
    id: 'blog_3',
    title: '5 Timeless Principles for an Enduring Kitchen Renovation',
    slug: '5-timeless-principles-for-an-enduring-kitchen-renovation',
    excerpt: 'Avoid fleeting kitchen fads with these five enduring design standards: proportion, appliance concealment, and authentic natural stone.',
    content: `
# 5 Timeless Principles for an Enduring Kitchen Renovation

A bespoke kitchen represents one of the most substantial investments in any residential project. Because a culinary space must endure years of intensive use while retaining its aesthetic elegance, passing trends must be filtered through the lens of longevity.

### 1. Integrate and Conceal
Visual calm in an open-concept living space depends heavily on seamless cabinetry. Panel-ready refrigeration and hidden appliance garages keep messy countertop gadgets out of sight.

### 2. Natural Stone Over Engineered Quartz
While composite quartz offers predictability, nothing replicates the depth, subtle veining, and age-old patina of authentic marble, quartzite, or soapstone.

### 3. Dedicated Task and Ambient Zones
Separate your under-cabinet LED preparation task lights from atmospheric pendant glows and toe-kick cove accents.
    `,
    coverImage: 'https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&w=1600&q=80',
    author: {
      name: 'Marcus Sterling',
      role: 'Project Architect',
      avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80'
    },
    publishedDate: '2025-02-25',
    tags: ['Kitchen Design', 'Renovation', 'Marble', 'Cabinetry'],
    readTimeMinutes: 4
  }
];

export const initialBookings = [
  {
    id: 'booking_1',
    userId: 'user_client_1',
    userName: 'Julian Sterling',
    userEmail: 'client@atelierlux.com',
    userPhone: '+1 (555) 234-8901',
    serviceId: 'service_2',
    serviceName: 'Full Room Architectural Transformation',
    date: '2025-03-24',
    timeSlot: '14:00 - 15:30',
    status: 'confirmed' as const,
    budget: '$50,000 - $75,000',
    roomDetails: {
      roomType: 'Living Room & Open Dining',
      approxSqFt: 750,
      propertyAddress: '74 Mercer St, Penthouse B, New York, NY',
      timeline: 'Within 3 Months'
    },
    notes: 'Interested in a Scandinavian Japandi aesthetic with custom white oak millwork and integrated fireplace mantel.',
    designerNotes: 'Client shared floor plans. Approved for initial architectural walkthrough on the 24th.',
    createdAt: '2025-02-20T11:20:00.000Z'
  },
  {
    id: 'booking_2',
    userId: 'user_client_2',
    userName: 'Sienna Brooks',
    userEmail: 'sienna@example.com',
    userPhone: '+1 (555) 876-5432',
    serviceId: 'service_1',
    serviceName: 'Essential Spatial Styling & Curation',
    date: '2025-03-29',
    timeSlot: '10:00 - 11:30',
    status: 'pending' as const,
    budget: '$20,000 - $35,000',
    roomDetails: {
      roomType: 'Primary Bedroom Suite',
      approxSqFt: 420,
      propertyAddress: '1240 Green St, San Francisco, CA',
      timeline: '1-2 Months'
    },
    notes: 'Looking to replace outdated furniture with serene minimalist textures and custom linen drapery.',
    createdAt: '2025-02-26T16:40:00.000Z'
  }
];

export const initialReviews = [
  {
    id: 'review_1',
    userId: 'user_client_1',
    userName: 'Julian Sterling',
    userAvatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    targetType: 'design' as const,
    targetId: 'design_1',
    rating: 5,
    comment: 'The Kyoto Villa transformation exceeded every expectation. The limewash walls and bespoke oak shelving completely shifted how my family experiences our living space every evening.',
    verifiedBooking: true,
    createdAt: '2025-02-15T14:10:00.000Z'
  },
  {
    id: 'review_2',
    userId: 'user_client_2',
    userName: 'Sienna Brooks',
    userAvatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=400&q=80',
    targetType: 'service' as const,
    targetId: 'service_2',
    rating: 5,
    comment: 'Eleanor and her design team handled our historic home renovation with immaculate attention to architectural detail. Communication was proactive and transparent throughout.',
    verifiedBooking: true,
    createdAt: '2025-02-24T09:30:00.000Z'
  }
];

export const initialInquiries = [
  {
    id: 'inq_1',
    name: 'Harrison Reed',
    email: 'harrison.reed@example.com',
    phone: '+1 (555) 349-2810',
    subject: 'New Construction Villa Consultation',
    message: 'We are breaking ground on a 6,500 sq ft modern estate in Aspen and are looking for turnkey interior architectural collaboration starting late spring.',
    status: 'new' as const,
    createdAt: '2025-02-27T10:00:00.000Z'
  }
];
