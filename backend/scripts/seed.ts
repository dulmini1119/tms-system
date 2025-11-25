// src/scripts/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed data...');

  // --- 1. SEED ROLES ---
  console.log('Seeding roles...');
  const rolesToCreate = [
    { name: 'Super Admin', code: 'superadmin' },       // <-- ADDED 'code'
    { name: 'Vehicle Admin', code: 'vehicleadmin' },   // <-- ADDED 'code'
    { name: 'Manager', code: 'manager' },               // <-- ADDED 'code'
    { name: 'Head of Department', code: 'hod' },        // <-- ADDED 'code'
    { name: 'Employee', code: 'employee' },             // <-- ADDED 'code'
    { name: 'Driver', code: 'driver' },                 // <-- ADDED 'code'
  ];

  for (const roleData of rolesToCreate) {
    const exists = await prisma.roles.findUnique({
      where: { code: roleData.code }, // Check for existence by unique 'code'
    });

    if (!exists) {
      await prisma.roles.create({
        data: roleData,
      });
      console.log(`Created role: ${roleData.name} (${roleData.code})`);
    } else {
      console.log(`Role already exists: ${roleData.name} (${roleData.code})`);
    }
  }

  // --- 2. SEED USERS ---
  console.log('\nSeeding users...');
  const usersToCreate = [
    {
      email: 'superadmin@lkcompany.com',
      password: 'admin123',
      first_name: 'Super',
      last_name: 'Admin',
      position: 'superadmin',
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

  for (const userData of usersToCreate) {
    const exists = await prisma.users.findUnique({
      where: { email: userData.email },
    });

    if (!exists) {
      const hashedPassword = await bcrypt.hash(userData.password, 10);
      await prisma.users.create({
        data: {
          email: userData.email.toLowerCase(),
          password_hash: hashedPassword,
          first_name: userData.first_name,
          last_name: userData.last_name,
          position: userData.position,
          employee_id: userData.employee_id,
          status: 'Active',
        },
      });
      console.log(`Created user: ${userData.email}`);
    } else {
      console.log(`User already exists: ${userData.email}`);
    }
  }

  // --- 3. LINK USERS TO ROLES ---
  console.log('\nLinking users to roles...');
  for (const userData of usersToCreate) {
    const user = await prisma.users.findUnique({ where: { email: userData.email } });
    // Find the role by its unique CODE
    const role = await prisma.roles.findUnique({ where: { code: userData.position } });

    if (user && role) {
      const existingLink = await prisma.user_roles.findUnique({
        where: {
          user_id_role_id: {
            user_id: user.id,
            role_id: role.id,
          },
        },
      });

      if (!existingLink) {
        await prisma.user_roles.create({
          data: {
            user_id: user.id,
            role_id: role.id,
          },
        });
        console.log(`Linked user ${user.email} to role ${role.name}`);
      } else {
        console.log(`User ${user.email} already linked to role ${role.name}`);
      }
    }
  }

  console.log('\nSeeding finished successfully!');
}

main()
  .catch((e) => {
    console.error('Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });