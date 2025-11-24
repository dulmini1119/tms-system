// src/scripts/seed.ts  (FIXED VERSION)
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting Sri Lankan seed data...');

  const users = [
    {
      email: 'superadmin@lkcompany.com',
      password: 'Super@123',
      first_name: 'Super',
      last_name: 'Admin',
      position: 'superadmin',        // ← use "position", not "role"
      employee_id: 'EMP001',
    },
    {
      email: 'vehicleadmin@lkcompany.com',
      password: 'Vehicle@123',
      first_name: 'Vehicle',
      last_name: 'Admin',
      position: 'vehicleadmin',
      employee_id: 'EMP002',
    },
    {
      email: 'manager@lkcompany.com',
      password: 'Manager@123',
      first_name: 'Manager',
      last_name: 'User',
      position: 'manager',
      employee_id: 'EMP003',
    },
    {
      email: 'hod@lkcompany.com',
      password: 'Hod@123',
      first_name: 'Head',
      last_name: 'Department',
      position: 'hod',
      employee_id: 'EMP004',
    },
    {
      email: 'employee@lkcompany.com',
      password: 'Employee@123',
      first_name: 'Regular',
      last_name: 'Employee',
      position: 'employee',
      employee_id: 'EMP005',
    },
    {
      email: 'driver@lkcompany.com',
      password: 'Driver@123',
      first_name: 'Sri',
      last_name: 'Driver',
      position: 'driver',
      employee_id: 'EMP006',
    },
  ];

  for (const user of users) {
    const exists = await prisma.users.findUnique({
      where: { email: user.email },
    });

    if (exists) {
      console.log(`Already exists: ${user.email}`);
      continue;
    }

    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.users.create({
      data: {
        email: user.email.toLowerCase(),
        password_hash: hashedPassword,
        first_name: user.first_name,
        last_name: user.last_name,
        position: user.position,           // ← THIS IS THE KEY
        employee_id: user.employee_id,
        status: 'Active',
      },
    });

    console.log(`${user.position}: ${user.email} / ${user.password}`);
  }

}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });