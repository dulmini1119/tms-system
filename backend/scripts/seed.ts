// src/scripts/seed.ts
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // 1. ROLES
  const roles = [
    { name: 'Super Admin', code: 'superadmin' },
    { name: 'Vehicle Admin', code: 'vehicleadmin' },
    { name: 'Manager', code: 'manager' },
    { name: 'Head of Department', code: 'hod' },
    { name: 'Employee', code: 'employee' },
    { name: 'Driver', code: 'driver' },
  ];

  for (const r of roles) {
    await prisma.roles.upsert({
      where: { code: r.code },
      update: {},
      create: r,
    });
    console.log(`Role: ${r.name}`);
  }

  // 2. USERS
  const users = [
    { email: 'superadmin@lkcompany.com', password: 'admin123', first_name: 'Super', last_name: 'Admin', employee_id: 'EMP001', roleCode: 'superadmin' },
    { email: 'vehicleadmin@lkcompany.com', password: 'Vehicle@123', first_name: 'Vehicle', last_name: 'Admin', employee_id: 'EMP002', roleCode: 'vehicleadmin' },
    { email: 'manager@lkcompany.com', password: 'Manager@123', first_name: 'Manager', last_name: 'User', employee_id: 'EMP003', roleCode: 'manager' },
    { email: 'hod@lkcompany.com', password: 'Hod@123', first_name: 'Head', last_name: 'Department', employee_id: 'EMP004', roleCode: 'hod' },
    { email: 'employee@lkcompany.com', password: 'Employee@123', first_name: 'Regular', last_name: 'Employee', employee_id: 'EMP005', roleCode: 'employee' },
    { email: 'driver@lkcompany.com', password: 'Driver@123', first_name: 'Sri', last_name: 'Driver', employee_id: 'EMP006', roleCode: 'driver' },
  ];

  for (const u of users) {
    const hashed = await bcrypt.hash(u.password, 12);
    await prisma.users.upsert({
      where: { email: u.email },
      update: {},
      create: {
        email: u.email.toLowerCase(),
        password_hash: hashed,
        first_name: u.first_name,
        last_name: u.last_name,
        employee_id: u.employee_id,
        status: 'Active',
        // position field exists in your schema → safe to use
        position: u.roleCode.toUpperCase(),
      },
    });
    console.log(`User: ${u.email}`);
  }

  // 3. LINK USERS → ROLES (Correct Table Name!)
  for (const u of users) {
    const user = await prisma.users.findUnique({ where: { email: u.email } });
    const role = await prisma.roles.findUnique({ where: { code: u.roleCode } });

    if (user && role) {
      await prisma.user_roles.upsert({
        where: {
          user_id_role_id: { user_id: user.id, role_id: role.id },
        },
        update: {},
        create: {
          user_id: user.id,
          role_id: role.id,
          status: 'Active',
        },
      });
      console.log(`Linked: ${u.email} → ${role.name}`);
    }
  }

  console.log('\nSEED COMPLETED SUCCESSFULLY!');
}

main()
  .catch(e => {
    console.error('SEED FAILED:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });