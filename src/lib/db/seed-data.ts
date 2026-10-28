import { hashPassword } from '../auth/crypto';

export const DEFAULT_DEMO_PASSWORD = 'ShareSpace2026!';

export function getInitialSeedData() {
  const commonPasswordHash = hashPassword(DEFAULT_DEMO_PASSWORD);

  const institution = {
    id: 'inst-apex-01',
    name: 'Apex Institute of Science & Technology',
    slug: 'apex-tech',
    domain: 'sharespace.edu',
    description: 'Premier institutional research university driving advanced cross-disciplinary innovation and shared scientific infrastructure.',
    location: 'Cambridge Research Corridor, Massachusetts',
    policy_settings: JSON.stringify({
      max_active_bookings_per_user: 3,
      max_advance_booking_days: 30,
      cancellation_lead_hours: 12,
      fair_allocation_mode: 'explainable_fifo',
      require_two_party_handover: true,
      auto_promote_waitlist: true
    })
  };

  const users = [
    {
      id: 'usr-admin-01',
      email: 'admin@sharespace.edu',
      password_hash: commonPasswordHash,
      full_name: 'Sarah Chen',
      role: 'admin',
      institution_id: institution.id,
      department: 'Office of the Vice Chancellor / Digital Governance',
      avatar_url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=160&auto=format&fit=crop&q=80',
      phone: '+1 (617) 555-0100',
      status: 'active'
    },
    {
      id: 'usr-inst-01',
      email: 'marcus.vance@sharespace.edu',
      password_hash: commonPasswordHash,
      full_name: 'Marcus Vance',
      role: 'institution_manager',
      institution_id: institution.id,
      department: 'Central Research Infrastructure & Equipment Oversight',
      avatar_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=160&auto=format&fit=crop&q=80',
      phone: '+1 (617) 555-0105',
      status: 'active'
    },
    {
      id: 'usr-owner-01',
      email: 'dr.aris.thorne@sharespace.edu',
      password_hash: commonPasswordHash,
      full_name: 'Dr. Aris Thorne',
      role: 'owner',
      institution_id: institution.id,
      department: 'Department of Precision Engineering & Additive Manufacturing',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      phone: '+1 (617) 555-0120',
      status: 'active'
    },
    {
      id: 'usr-owner-02',
      email: 'clara.oswald@sharespace.edu',
      password_hash: commonPasswordHash,
      full_name: 'Clara Oswald',
      role: 'owner',
      institution_id: institution.id,
      department: 'Bio-Imaging Center & Electron Microscopy Facility',
      avatar_url: 'https://images.unsplash.com/photo-1580489944761-15a19d654956?w=160&auto=format&fit=crop&q=80',
      phone: '+1 (617) 555-0125',
      status: 'active'
    },
    {
      id: 'usr-seeker-01',
      email: 'elena.rostova@sharespace.edu',
      password_hash: commonPasswordHash,
      full_name: 'Elena Rostova',
      role: 'seeker',
      institution_id: institution.id,
      department: 'Robotics & Autonomous Aerostructures Lab',
      avatar_url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=160&auto=format&fit=crop&q=80',
      phone: '+1 (617) 555-0140',
      status: 'active'
    },
    {
      id: 'usr-seeker-02',
      email: 'david.kim@sharespace.edu',
      password_hash: commonPasswordHash,
      full_name: 'David Kim',
      role: 'seeker',
      institution_id: institution.id,
      department: 'Department of Applied Physics & Photonics',
      avatar_url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=160&auto=format&fit=crop&q=80',
      phone: '+1 (617) 555-0145',
      status: 'active'
    },
    {
      id: 'usr-seeker-03',
      email: 'maya.patel@sharespace.edu',
      password_hash: commonPasswordHash,
      full_name: 'Maya Patel',
      role: 'seeker',
      institution_id: institution.id,
      department: 'Biomedical Innovation & Regenerative Therapies',
      avatar_url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=160&auto=format&fit=crop&q=80',
      phone: '+1 (617) 555-0150',
      status: 'active'
    }
  ];

  const resources = [
    {
      id: 'res-sem-01',
      title: '4K Electron Microscope Lab (JEOL FE-SEM)',
      slug: 'jeol-fe-sem-7610f',
      description: 'High-resolution nanoscale imaging station to inspect materials, microchips, and cell structures down to atomic details. Includes EDS chemical detector.',
      category: 'Microscopy & Imaging',
      resource_type: 'equipment',
      institution_id: institution.id,
      owner_id: 'usr-owner-02',
      location: 'Bio-Imaging Core Facility, Building 4, Room B-12',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1579154204601-01588f351e67?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '08:00', end: '22:00', days: [1, 2, 3, 4, 5, 6] }),
      min_duration_minutes: 60,
      max_duration_minutes: 240,
      lead_time_hours: 24,
      max_capacity: 2,
      deposit_amount: 5000.00,
      usage_instructions: 'Vacuum evacuation cycle takes 12 minutes. Sample must be completely desiccated and non-outgassing. Sputter coat non-conductive specimens with gold/palladium before loading.',
      safety_instructions: 'High voltage operation (up to 30 kV). Liquid nitrogen cold trap refilling requires cryogenic safety gloves and face shield.',
      supervision_required: 1,
      status: 'active'
    },
    {
      id: 'res-cnc-02',
      title: '5-Axis CNC Precision Milling Machine (DMG MORI)',
      slug: 'dmg-mori-dmu-50-5-axis',
      description: 'Heavy-duty computer-controlled milling machine for cutting precision metal, composite, and aerospace parts directly from 3D CAD models.',
      category: 'Advanced Fabrication',
      resource_type: 'equipment',
      institution_id: institution.id,
      owner_id: 'usr-owner-01',
      location: 'Precision Fabrication Facility, North Wing Shop 108',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1504917599217-d4dc5ebe6122?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '08:00', end: '19:00', days: [1, 2, 3, 4, 5] }),
      min_duration_minutes: 120,
      max_duration_minutes: 360,
      lead_time_hours: 48,
      max_capacity: 2,
      deposit_amount: 10000.00,
      usage_instructions: 'CAM toolpaths must be simulated in Mastercam or Fusion 360 and approved by shop staff. Zero workpiece coordinate system with Renishaw touch probe prior to spindle start.',
      safety_instructions: 'Z87.1 ANSI eye protection and steel-toe footwear mandatory. Never override door interlock switches during rapid traverse.',
      supervision_required: 1,
      status: 'active'
    },
    {
      id: 'res-sla-03',
      title: 'Formlabs Large 3D Resin Printer (Form 4L)',
      slug: 'formlabs-form-4l-sla',
      description: 'High-detail industrial 3D resin printer for super smooth engineering prototypes, mechanical gears, product casings, and precision models.',
      category: 'Additive Manufacturing',
      resource_type: 'equipment',
      institution_id: institution.id,
      owner_id: 'usr-owner-01',
      location: 'Rapid Prototyping Laboratory, West Hall Room 204',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1581092335397-9583fe92d232?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '07:00', end: '23:00', days: [1, 2, 3, 4, 5, 6, 7] }),
      min_duration_minutes: 60,
      max_duration_minutes: 480,
      lead_time_hours: 12,
      max_capacity: 3,
      deposit_amount: 2000.00,
      usage_instructions: 'Check optical cassette window for debris before starting print job. Use Form Wash (99% IPA) and Form Cure according to specific resin profile chart.',
      safety_instructions: 'Nitrile gloves required for liquid resin handling. Ventilated solvent station must be running during IPA washing and part detachment.',
      supervision_required: 0,
      status: 'active'
    },
    {
      id: 'res-cinema-04',
      title: 'Sony FX6 4K Cinema Camera Kit with G-Master Lenses',
      slug: 'sony-fx6-cinema-package',
      description: 'Full filmmaking bundle with Sony FX6 4K camera, sharp prime lenses, wireless audio mics, tripod, and monitor for student films and creative video shoots.',
      category: 'Media & Optics',
      resource_type: 'equipment',
      institution_id: institution.id,
      owner_id: 'usr-owner-01',
      location: 'Digital Media Production Studio, Media Arts Annex Suite 12',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1492691527719-9d1e07e534b4?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '08:00', end: '20:00', days: [1, 2, 3, 4, 5, 6] }),
      min_duration_minutes: 180,
      max_duration_minutes: 720,
      lead_time_hours: 24,
      max_capacity: 4,
      deposit_amount: 8000.00,
      usage_instructions: 'Clean lenses only with Zeiss optical lens solution and designated microfiber cloths. Format CFexpress Type-A cards in-camera prior to shooting.',
      safety_instructions: 'Heavy Pelican transit flight case (32 kg). Ensure camera mounting plate safety lock clicks into tripod dovetail before releasing grip.',
      supervision_required: 0,
      status: 'active'
    },
    {
      id: 'res-cleanroom-05',
      title: 'Micro-Chip & Nanotech Cleanroom Lab',
      slug: 'iso5-cleanroom-photolithography',
      description: 'Dust-free specialized laboratory for semiconductor chip prototyping, microfabrication, circuit etching, and sensor experiments.',
      category: 'Microfabrication',
      resource_type: 'laboratory',
      institution_id: institution.id,
      owner_id: 'usr-owner-02',
      location: 'Nanotechnology Complex, Cleanroom Bay C (Sub-Basement)',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581093458791-9f3c3900df4b?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '07:00', end: '21:00', days: [1, 2, 3, 4, 5] }),
      min_duration_minutes: 120,
      max_duration_minutes: 480,
      lead_time_hours: 48,
      max_capacity: 4,
      deposit_amount: 6000.00,
      usage_instructions: 'Complete gowning protocol in Antechamber A. Chemical acid/solvent hoods operate on dedicated negative-pressure scrubber exhaust.',
      safety_instructions: 'Hydrofluoric (HF) acid protocol in effect; calcium gluconate gel inspected monthly at eyewash stations. Buddy system mandatory at all times.',
      supervision_required: 1,
      status: 'active'
    },
    {
      id: 'res-dgx-06',
      title: 'NVIDIA AI Supercomputer Cluster (8x H100 GPUs)',
      slug: 'nvidia-dgx-h100-cluster-node',
      description: 'Massive GPU computing power for training AI models, large language models (LLMs), computer vision algorithms, and complex scientific simulations.',
      category: 'Computing Clusters',
      resource_type: 'facility',
      institution_id: institution.id,
      owner_id: 'usr-owner-01',
      location: 'Central Supercomputing Facility, Server Vault Rack 42',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1544197150-b99a580bb7a8?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '00:00', end: '23:59', days: [1, 2, 3, 4, 5, 6, 7] }),
      min_duration_minutes: 60,
      max_duration_minutes: 1440,
      lead_time_hours: 6,
      max_capacity: 1,
      deposit_amount: 0.00,
      usage_instructions: 'Slurm scheduler allocation. Containerized workloads only (NVIDIA Docker / Singularity). Checkpoint model weights every 30 minutes to persistent scratch volume.',
      safety_instructions: 'Remote compute access; thermal throttling monitored automatically. Unattended non-converging jobs exceeding memory limits are automatically evicted.',
      supervision_required: 0,
      status: 'active'
    },
    {
      id: 'res-anechoic-07',
      title: 'Soundproof Acoustic Studio & Audio Chamber',
      slug: 'acoustic-anechoic-chamber',
      description: 'Echo-free soundproof chamber with 3D audio sensors for acoustic testing, speaker calibration, podcasting, and spatial audio projects.',
      category: 'Testing & Characterization',
      resource_type: 'room',
      institution_id: institution.id,
      owner_id: 'usr-owner-01',
      location: 'Acoustics & Dynamic Systems Facility, Building 8 Sound Suite',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1598488035139-bdbb2231ce04?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '08:00', end: '20:00', days: [1, 2, 3, 4, 5] }),
      min_duration_minutes: 60,
      max_duration_minutes: 360,
      lead_time_hours: 24,
      max_capacity: 3,
      deposit_amount: 3000.00,
      usage_instructions: 'Walk only on the spring-tensioned wire floor grid. Do not lean items or specimens against absorption wedges.',
      safety_instructions: 'Chamber acoustic seal door features internal emergency release push-bar. Stay duration inside total silence should not exceed 3 hours continuous.',
      supervision_required: 0,
      status: 'active'
    },
    {
      id: 'res-vna-08',
      title: 'Wireless & RF Signal Analyzer (Keysight 67 GHz)',
      slug: 'keysight-67ghz-vna',
      description: 'High-frequency radio testing workstation for measuring antennas, 5G/6G wireless devices, Bluetooth circuits, and radar components.',
      category: 'Electronics & RF',
      resource_type: 'equipment',
      institution_id: institution.id,
      owner_id: 'usr-owner-02',
      location: 'High-Frequency Microwave Lab, Engineering Quad Rm 314',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092162384-8987c1d64718?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1517077304055-6e89abbf09b0?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '08:30', end: '19:30', days: [1, 2, 3, 4, 5] }),
      min_duration_minutes: 60,
      max_duration_minutes: 300,
      lead_time_hours: 12,
      max_capacity: 2,
      deposit_amount: 4000.00,
      usage_instructions: 'Calibrate with torque wrench set precisely to 8 in-lbs (0.9 Nm) for 1.85mm precision RF connectors. Never cross-thread test port couplers.',
      safety_instructions: 'Electrostatic discharge (ESD) wrist strap grounded to station bus bar required before touching test leads.',
      supervision_required: 0,
      status: 'active'
    },
    {
      id: 'res-instron-09',
      title: 'Materials Strength & Tensile Tester (Instron 250 kN)',
      slug: 'instron-5985-materials-testing',
      description: 'Stress and load testing rig to measure how much weight, tension, and bending force materials can withstand before breaking.',
      category: 'Mechanical Testing',
      resource_type: 'equipment',
      institution_id: institution.id,
      owner_id: 'usr-owner-01',
      location: 'Materials Characterization Core, Hall of Engineering Room 112',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1581092580497-e0d23cbdf1dc?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1507668077129-56e32842fceb?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '08:00', end: '18:00', days: [1, 2, 3, 4, 5] }),
      min_duration_minutes: 60,
      max_duration_minutes: 360,
      lead_time_hours: 24,
      max_capacity: 2,
      deposit_amount: 3500.00,
      usage_instructions: 'Verify load cell mechanical stops are calibrated. Mount specimen in hydraulic wedge grips before zeroing displacement transducer.',
      safety_instructions: 'Safety interlock shield must be lowered before initiating tensile test to catch sample fracture fragmentation.',
      supervision_required: 1,
      status: 'active'
    },
    {
      id: 'res-uhplc-10',
      title: 'Chemical & Bio-Molecular Analyzer (UHPLC-MS)',
      slug: 'agilent-1290-uhplc',
      description: 'Precision biochemistry analyzer for testing chemical purity, organic compounds, medicines, water samples, and metabolic fluids.',
      category: 'Bioanalytical Core',
      resource_type: 'equipment',
      institution_id: institution.id,
      owner_id: 'usr-owner-02',
      location: 'Bioanalytical Chemistry Center, Science Complex Rm 419',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1532187863486-abf9dbad1b69?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1582719478250-c89cae4dc85b?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '08:00', end: '20:00', days: [1, 2, 3, 4, 5] }),
      min_duration_minutes: 90,
      max_duration_minutes: 480,
      lead_time_hours: 24,
      max_capacity: 2,
      deposit_amount: 2500.00,
      usage_instructions: 'Mobile phase solvents must be LC-MS grade and filtered through 0.2 micron PTFE membranes. Purge column thoroughly after salt-buffered gradients.',
      safety_instructions: 'Fume extraction attached to solvent waste carboy. Check waste level sensor daily before starting overnight sequence.',
      supervision_required: 0,
      status: 'active'
    },
    {
      id: 'res-drone-11',
      title: 'DJI Enterprise 4K Thermal Drone Kit',
      slug: 'dji-matrice-350-rtk',
      description: 'Professional drone with thermal infrared camera, high zoom, and GPS mapping for aerial photography, terrain mapping, and robotics testing.',
      category: 'Field Equipment',
      resource_type: 'equipment',
      institution_id: institution.id,
      owner_id: 'usr-owner-01',
      location: 'Autonomous Systems & Field Operations Depot, Hangar B',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1508614589041-895b88991e3e?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1473968512647-3e447244af8f?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '07:00', end: '19:00', days: [1, 2, 3, 4, 5, 6, 7] }),
      min_duration_minutes: 120,
      max_duration_minutes: 480,
      lead_time_hours: 48,
      max_capacity: 2,
      deposit_amount: 12000.00,
      usage_instructions: 'Pre-flight airspace check and NOTAM submission required via campus flight coordinator. TB65 intelligent flight batteries must be transported in fireproof LiPo bags.',
      safety_instructions: 'FAA Part 107 Remote Pilot Certificate and campus field flight authorization mandatory.',
      supervision_required: 1,
      status: 'active'
    },
    {
      id: 'res-vr-12',
      title: 'Spatial VR Arena & Motion Capture Studio',
      slug: 'optitrack-spatial-vr-arena',
      description: 'Full-room 3D motion tracking studio with VR headsets and wearable trackers for video game development, sports biomechanics, and virtual reality.',
      category: 'Human-Machine Interaction',
      resource_type: 'room',
      institution_id: institution.id,
      owner_id: 'usr-owner-01',
      location: 'Perceptual Computing Lab, Interactive Arts Center Studio 3',
      images: JSON.stringify([
        'https://images.unsplash.com/photo-1592478411213-6153e4ebc07d?w=800&auto=format&fit=crop&q=80',
        'https://images.unsplash.com/photo-1535223289827-42f1e9919769?w=800&auto=format&fit=crop&q=80'
      ]),
      operating_hours: JSON.stringify({ start: '09:00', end: '22:00', days: [1, 2, 3, 4, 5, 6] }),
      min_duration_minutes: 60,
      max_duration_minutes: 240,
      lead_time_hours: 12,
      max_capacity: 6,
      deposit_amount: 3000.00,
      usage_instructions: 'Calibrate tracking wand volume before recording trials. Wear provided cleanroom socks or non-marking indoor shoes within tracking boundary.',
      safety_instructions: 'Ensure virtual boundary guardian grid is active to avoid collisions with perimeter camera tripods and wall trusses.',
      supervision_required: 0,
      status: 'active'
    }
  ];

  const eligibilityRequirements = [
    {
      id: 'req-sem-01',
      resource_id: 'res-sem-01',
      requirement_type: 'training',
      title: 'Electron Microscopy Operator Certification (EM-102)',
      description: 'Completion of 6-hour practical training module on JEOL electron optics, vacuum pump cycles, and EDS calibration.',
      is_mandatory: 1
    },
    {
      id: 'req-cnc-01',
      resource_id: 'res-cnc-02',
      requirement_type: 'qualification',
      title: 'Advanced 5-Axis CNC Machining Safety Qualification',
      description: 'Verified completion of CAM toolpath simulation and hands-on workpiece fixture safety protocol.',
      is_mandatory: 1
    },
    {
      id: 'req-cleanroom-01',
      resource_id: 'res-cleanroom-05',
      requirement_type: 'safety_cert',
      title: 'ISO-5 Cleanroom Hazardous Chemical & HF Safety Protocol',
      description: 'Annual certification on acid hoods, hydrofluoric acid safety, and cleanroom gowning standards.',
      is_mandatory: 1
    },
    {
      id: 'req-drone-01',
      resource_id: 'res-drone-11',
      requirement_type: 'qualification',
      title: 'FAA Part 107 Commercial Drone Pilot License',
      description: 'Active remote pilot certificate and campus flight authorization safety registration.',
      is_mandatory: 1
    }
  ];

  const eligibilityVerifications = [
    {
      id: 'ver-elena-01',
      user_id: 'usr-seeker-01',
      requirement_type: 'training',
      institution_id: institution.id,
      status: 'verified',
      verified_by: 'usr-owner-02',
      verification_notes: 'Demonstrated high competence in SEM vacuum handling and beam alignment during workshop.',
      expires_at: '2027-12-31 23:59:59'
    },
    {
      id: 'ver-elena-02',
      user_id: 'usr-seeker-01',
      requirement_type: 'qualification',
      institution_id: institution.id,
      status: 'verified',
      verified_by: 'usr-owner-01',
      verification_notes: 'Passed 5-axis DMG MORI hands-on setup exam with 100% safety score.',
      expires_at: '2027-06-30 23:59:59'
    },
    {
      id: 'ver-david-01',
      user_id: 'usr-seeker-02',
      requirement_type: 'training',
      institution_id: institution.id,
      status: 'verified',
      verified_by: 'usr-owner-02',
      verification_notes: 'Certified for electron microscopy and cleanroom optics.',
      expires_at: '2027-12-31 23:59:59'
    },
    {
      id: 'ver-david-02',
      user_id: 'usr-seeker-02',
      requirement_type: 'safety_cert',
      institution_id: institution.id,
      status: 'pending',
      verified_by: null,
      verification_notes: 'Submitted annual chemical safety renewal document, pending hazardous materials officer review.',
      expires_at: null
    },
    {
      id: 'ver-maya-01',
      user_id: 'usr-seeker-03',
      requirement_type: 'qualification',
      institution_id: institution.id,
      status: 'rejected',
      verified_by: 'usr-inst-01',
      verification_notes: 'Missing FAA Part 107 recurrent flight training documentation for industrial drone operations.',
      expires_at: null
    }
  ];

  const bookings = [
    {
      id: 'bk-01',
      booking_reference: 'BK-2026-8941',
      resource_id: 'res-sem-01',
      user_id: 'usr-seeker-01',
      purpose: 'Characterizing titanium aluminide lattice grain boundaries manufactured via electron beam powder bed fusion.',
      project_name: 'DARPA Next-Gen Hypersonic Aero-Structures',
      start_time: '2026-10-29 09:00:00',
      end_time: '2026-10-29 12:00:00',
      status: 'approved',
      decision_reason: 'All prerequisite certifications in order. Research project authorized by department chair.',
      decided_by: 'usr-owner-02',
      decided_at: '2026-10-28 14:30:00'
    },
    {
      id: 'bk-02',
      booking_reference: 'BK-2026-8942',
      resource_id: 'res-cnc-02',
      user_id: 'usr-seeker-01',
      purpose: 'Five-axis contour milling of turbine blisk test fixtures for wind-tunnel aerodynamic velocity study.',
      project_name: 'Aerospace Propulsion & Boundary Layer Analysis',
      start_time: '2026-10-28 10:00:00',
      end_time: '2026-10-28 14:00:00',
      status: 'checked_in',
      decision_reason: 'Tooling paths reviewed and verified by shop custodian.',
      decided_by: 'usr-owner-01',
      decided_at: '2026-10-27 16:00:00'
    },
    {
      id: 'bk-03',
      booking_reference: 'BK-2026-8943',
      resource_id: 'res-cinema-04',
      user_id: 'usr-seeker-02',
      purpose: 'High-speed 120fps video recording of fluid droplet surface tension detachment under acoustic levitation.',
      project_name: 'Fluidic Acoustics & Micro-Droplet Dynamics',
      start_time: '2026-10-27 13:00:00',
      end_time: '2026-10-27 17:00:00',
      status: 'return_pending_inspection',
      decision_reason: 'Approved for graduate thesis optical documentation.',
      decided_by: 'usr-owner-01',
      decided_at: '2026-10-26 11:20:00'
    },
    {
      id: 'bk-04',
      booking_reference: 'BK-2026-8944',
      resource_id: 'res-sla-03',
      user_id: 'usr-seeker-03',
      purpose: 'Printing patient-specific bio-absorbable vascular scaffold prototypes using surgical guide resin.',
      project_name: 'Microvascular Engineering for Tissue Regeneration',
      start_time: '2026-10-25 09:00:00',
      end_time: '2026-10-25 15:00:00',
      status: 'returned',
      decision_reason: 'Material safety data sheet approved.',
      decided_by: 'usr-owner-01',
      decided_at: '2026-10-24 10:00:00'
    },
    {
      id: 'bk-05',
      booking_reference: 'BK-2026-8945',
      resource_id: 'res-sem-01',
      user_id: 'usr-seeker-02',
      purpose: 'Sub-micron defect inspection on photonic crystal waveguides following plasma etching.',
      project_name: 'Integrated Silicon Photonics Modulators',
      start_time: '2026-10-29 09:00:00',
      end_time: '2026-10-29 12:00:00',
      status: 'waitlisted',
      decision_reason: 'Time slot overlaps with existing approved reservation BK-2026-8941. Queued in transparent FIFO waiting list.',
      decided_by: 'usr-owner-02',
      decided_at: '2026-10-28 15:10:00'
    },
    {
      id: 'bk-06',
      booking_reference: 'BK-2026-8946',
      resource_id: 'res-instron-09',
      user_id: 'usr-seeker-01',
      purpose: 'Tensile fracture testing of carbon fiber reinforced polymer coupon specimens according to ASTM D3039.',
      project_name: 'Lightweight Composite Aero-Structural Integrity',
      start_time: '2026-10-30 13:00:00',
      end_time: '2026-10-30 16:00:00',
      status: 'pending_approval',
      decision_reason: null,
      decided_by: null,
      decided_at: null
    }
  ];

  const waitingListEntries = [
    {
      id: 'wl-01',
      resource_id: 'res-sem-01',
      booking_id: 'bk-05',
      user_id: 'usr-seeker-02',
      position: 1,
      requested_start_time: '2026-10-29 09:00:00',
      requested_end_time: '2026-10-29 12:00:00',
      explanation: 'You are #1 on the waiting list. This slot was previously reserved by Elena Rostova (BK-2026-8941). If the active booking is cancelled or adjusted before 12h lead-time, you will be automatically promoted.',
      status: 'active',
      joined_at: '2026-10-28 15:10:00',
      promoted_at: null
    }
  ];

  const checkInRecords = [
    {
      id: 'chk-01',
      booking_id: 'bk-02',
      resource_id: 'res-cnc-02',
      user_id: 'usr-seeker-01',
      conducted_by: 'usr-owner-01',
      handover_time: '2026-10-28 09:55:00',
      initial_condition: 'pristine',
      accessories_included: JSON.stringify(['Renishaw OMP40-2 touch probe', 'ER32 precision collet set (18 pcs)', 'Magnetic chip conveyor tray']),
      notes: 'Bed cleaned and zeroed. Spindle runout measured within 0.002mm. Elena acknowledged safe speed limits.',
      image_urls: JSON.stringify(['https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=800&auto=format&fit=crop&q=80']),
      user_acknowledged: 1
    }
  ];

  const returnRecords = [
    {
      id: 'ret-01',
      booking_id: 'bk-04',
      resource_id: 'res-sla-03',
      user_id: 'usr-seeker-03',
      conducted_by: 'usr-owner-01',
      return_time: '2026-10-25 15:20:00',
      final_condition: 'good',
      accessories_returned: JSON.stringify(['Build platform', 'Form wash basket', 'Scraper tool', 'UV cure turntable']),
      condition_changed: 0,
      inspection_status: 'passed',
      notes: 'Resin tank cleaned and covered with UV lid. IPA bath rinsed. Zero resin contamination on optical glass.',
      image_urls: JSON.stringify(['https://images.unsplash.com/photo-1612815154858-60aa4c59eaa6?w=800&auto=format&fit=crop&q=80'])
    }
  ];

  const incidents = [
    {
      id: 'inc-01',
      incident_reference: 'INC-2026-0419',
      booking_id: 'bk-03',
      resource_id: 'res-cinema-04',
      reporter_id: 'usr-owner-01',
      category: 'missing_accessories',
      severity: 'medium',
      description: 'Upon return inspection of Sony FX6 package, the Sony FE 50mm f/1.2 GM rear lens cap was missing and the 82mm B+W UV protection filter showed fine superficial scratches on perimeter bezel.',
      evidence_urls: JSON.stringify(['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80']),
      status: 'under_review',
      assigned_to: 'usr-inst-01',
      resolution_notes: 'Marcus Vance contacted David Kim for clarification. Replacement rear cap sourced; filter optical clarity verified undamaged by lab technician.',
      resolved_at: null
    }
  ];

  const notifications = [
    {
      id: 'notif-01',
      user_id: 'usr-seeker-01',
      type: 'booking_approved',
      title: 'Booking Confirmed: JEOL FE-SEM 7610F',
      message: 'Your reservation BK-2026-8941 for Oct 29, 09:00 - 12:00 has been approved by Clara Oswald.',
      link: '/bookings/bk-01',
      is_read: 0
    },
    {
      id: 'notif-02',
      user_id: 'usr-seeker-02',
      type: 'waitlist_update',
      title: 'Waitlist Position: #1 on JEOL FE-SEM',
      message: 'Your overlapping request has been assigned Position #1 on the waiting list. You will be notified immediately if the active slot is cancelled.',
      link: '/my-bookings',
      is_read: 0
    },
    {
      id: 'notif-03',
      user_id: 'usr-owner-01',
      type: 'pending_approval',
      title: 'New Booking Request: Instron 5985 Frame',
      message: 'Elena Rostova submitted a booking request for Oct 30, 13:00 - 16:00 awaiting your review.',
      link: '/owner/requests',
      is_read: 0
    },
    {
      id: 'notif-04',
      user_id: 'usr-inst-01',
      type: 'incident_reported',
      title: 'Incident INC-2026-0419 Escalated for Review',
      message: 'Equipment inspection reported minor accessory anomaly on Sony FX6 package requiring administrative sign-off.',
      link: '/incidents/inc-01',
      is_read: 0
    }
  ];

  const auditEvents = [
    {
      id: 'aud-01',
      actor_id: 'usr-owner-02',
      actor_name: 'Clara Oswald',
      actor_role: 'owner',
      action_type: 'RESOURCE_LISTED',
      entity_type: 'resource',
      entity_id: 'res-sem-01',
      prev_state: null,
      new_state: 'active',
      decision_reason: 'Initial onboarding of JEOL JSM-7610F FE-SEM with mandatory certification rule.',
      metadata: JSON.stringify({ category: 'Microscopy & Imaging', lead_time_hours: 24 }),
      ip_address: '192.168.10.42'
    },
    {
      id: 'aud-02',
      actor_id: 'usr-seeker-01',
      actor_name: 'Elena Rostova',
      actor_role: 'seeker',
      action_type: 'BOOKING_REQUESTED',
      entity_type: 'booking',
      entity_id: 'bk-01',
      prev_state: null,
      new_state: 'pending_approval',
      decision_reason: 'Submitted for hypersonic aerospace research with verified EM-102 credential.',
      metadata: JSON.stringify({ resource: 'JEOL JSM-7610F', duration_minutes: 180 }),
      ip_address: '192.168.12.88'
    },
    {
      id: 'aud-03',
      actor_id: 'usr-owner-02',
      actor_name: 'Clara Oswald',
      actor_role: 'owner',
      action_type: 'BOOKING_APPROVED',
      entity_type: 'booking',
      entity_id: 'bk-01',
      prev_state: 'pending_approval',
      new_state: 'approved',
      decision_reason: 'Verified qualification EM-102 and non-outgassing alloy specimen declaration.',
      metadata: JSON.stringify({ approved_slot: '2026-10-29 09:00:00 - 12:00:00' }),
      ip_address: '192.168.10.42'
    },
    {
      id: 'aud-04',
      actor_id: 'usr-owner-01',
      actor_name: 'Dr. Aris Thorne',
      actor_role: 'owner',
      action_type: 'HANDOVER_COMPLETED',
      entity_type: 'check_in',
      entity_id: 'chk-01',
      prev_state: 'approved',
      new_state: 'checked_in',
      decision_reason: '5-Axis DMG MORI bed zeroed, Renishaw probe checked, tooling condition confirmed pristine.',
      metadata: JSON.stringify({ user: 'Elena Rostova', initial_condition: 'pristine' }),
      ip_address: '192.168.15.19'
    },
    {
      id: 'aud-05',
      actor_id: 'usr-owner-01',
      actor_name: 'Dr. Aris Thorne',
      actor_role: 'owner',
      action_type: 'INCIDENT_REPORTED',
      entity_type: 'incident',
      entity_id: 'inc-01',
      prev_state: null,
      new_state: 'under_review',
      decision_reason: 'Discrepancy noted on Sony FX6 return inspection (missing lens cap, scuffed bezel).',
      metadata: JSON.stringify({ category: 'missing_accessories', severity: 'medium' }),
      ip_address: '192.168.15.19'
    }
  ];

  return {
    institution,
    users,
    resources,
    eligibilityRequirements,
    eligibilityVerifications,
    bookings,
    waitingListEntries,
    checkInRecords,
    returnRecords,
    incidents,
    notifications,
    auditEvents
  };
}
