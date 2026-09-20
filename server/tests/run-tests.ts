import bcrypt from 'bcryptjs';
import { generateToken, verifyToken } from '../utils/jwt';
import { UserModel } from '../models/User';
import { BookingModel } from '../models/Booking';
import { DesignModel } from '../models/Design';

async function runTests() {
  console.log('==============================================');
  console.log('  RUNNING ATELIER LUXE BACKEND UNIT TESTS');
  console.log('==============================================\n');

  let passed = 0;
  let failed = 0;

  function assert(condition: boolean, testName: string) {
    if (condition) {
      console.log(`  ✓ PASS: ${testName}`);
      passed++;
    } else {
      console.error(`  ✗ FAIL: ${testName}`);
      failed++;
    }
  }

  // 1. Password Hashing & Salt Verification
  try {
    const rawPass = 'InteriorSecret2026!';
    const hash = bcrypt.hashSync(rawPass, 10);
    const matches = bcrypt.compareSync(rawPass, hash);
    const wrongMismatch = !bcrypt.compareSync('WrongPassword', hash);
    assert(matches && wrongMismatch, 'Password hashing and comparison with bcrypt');
  } catch (err) {
    assert(false, `Password hashing failed with error: ${err}`);
  }

  // 2. JWT Generation & Verification
  try {
    const token = generateToken({
      id: 'test_user_99',
      email: 'tester@atelierlux.com',
      role: 'user',
    });
    const payload = verifyToken(token);
    assert(
      payload !== null && payload.id === 'test_user_99' && payload.email === 'tester@atelierlux.com',
      'JWT signing and payload verification'
    );
  } catch (err) {
    assert(false, `JWT test failed: ${err}`);
  }

  // 3. User Model CRUD & Wishlist
  try {
    const testEmail = `test_${Date.now()}@test.com`;
    const created = UserModel.insertOne({
      name: 'Test Client',
      email: testEmail,
      passwordHash: bcrypt.hashSync('pass123', 8),
      role: 'user',
      wishlist: ['design_1'],
      status: 'active',
      createdAt: new Date().toISOString()
    });
    assert(created.id !== undefined && created.email === testEmail, 'User creation in database model');

    // Toggle wishlist
    const updated = UserModel.findByIdAndUpdate(created.id, {
      wishlist: [...created.wishlist, 'design_3']
    });
    assert(updated !== null && updated.wishlist.length === 2, 'User wishlist update persistence');

    // Clean up test user
    UserModel.findByIdAndDelete(created.id);
  } catch (err) {
    assert(false, `User model test failed: ${err}`);
  }

  // 4. Booking Flow & Status State Machine
  try {
    const booking = BookingModel.insertOne({
      userId: 'test_user_1',
      userName: 'Test Booker',
      userEmail: 'booker@test.com',
      serviceId: 'service_2',
      serviceName: 'Full Room Architectural Transformation',
      date: '2025-04-15',
      timeSlot: '14:00 - 15:30',
      status: 'pending',
      budget: '$50,000 - $75,000',
      createdAt: new Date().toISOString()
    });
    assert(booking.status === 'pending', 'Booking creation defaults to pending status');

    // Admin updates status to confirmed
    const confirmed = BookingModel.findByIdAndUpdate(booking.id, {
      status: 'confirmed',
      designerNotes: 'Approved by lead architect'
    });
    assert(
      confirmed !== null && confirmed.status === 'confirmed' && confirmed.designerNotes !== undefined,
      'Admin booking confirmation and designer notes update'
    );

    // Clean up test booking
    BookingModel.findByIdAndDelete(booking.id);
  } catch (err) {
    assert(false, `Booking test failed: ${err}`);
  }

  // 5. Design Model Filtering & Room Type
  try {
    const allDesigns = DesignModel.find();
    assert(allDesigns.length > 0, `Design model seeded with initial portfolio (${allDesigns.length} projects)`);

    const livingRooms = DesignModel.find(d => d.roomType === 'living-room' || d.category === 'Living Room');
    assert(livingRooms.length > 0, `Room type filtering returns living room projects (${livingRooms.length} found)`);
  } catch (err) {
    assert(false, `Design filtering test failed: ${err}`);
  }

  console.log('\n==============================================');
  console.log(`  TEST RESULTS: ${passed} PASSED, ${failed} FAILED`);
  console.log('==============================================\n');

  if (failed > 0) {
    process.exit(1);
  }
}

runTests();
