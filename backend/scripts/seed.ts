import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting Sri Lankan seed data...');

  const users = [
    {
      email: 'superadmin@lkcompany.com',
      password: 'Super@123',
      first_name: 'Super',
      last_name: 'Admin',
      role: 'superadmin',
      employee_id: 'EMP001',
    },
    {
      email: 'vehicleadmin@lkcompany.com',
      password: 'Vehicle@123',
      first_name: 'Vehicle',
      last_name: 'Admin',
      role: 'vehicleadmin',
      employee_id: 'EMP002',
    },
    {
      email: 'manager@lkcompany.com',
      password: 'Manager@123',
      first_name: 'Manager',
      last_name: 'User',
      role: 'manager',
      employee_id: 'EMP003',
    },
    {
      email: 'hod@lkcompany.com',
      password: 'Hod@123',
      first_name: 'Head',
      last_name: 'Department',
      role: 'hod',
      employee_id: 'EMP004',
    },
    {
      email: 'employee@lkcompany.com',
      password: 'Employee@123',
      first_name: 'Regular',
      last_name: 'Employee',
      role: 'employee',
      employee_id: 'EMP005',
    },
    {
      email: 'driver@lkcompany.com',
      password: 'Driver@123',
      first_name: 'Sri',
      last_name: 'Driver',
      role: 'driver',
      employee_id: 'EMP006',
    },
  ];

  for (const user of users) {
    const hashedPassword = await bcrypt.hash(user.password, 10);

    await prisma.users.create({
      data: {
        email: user.email,
        password_hash: hashedPassword,
        first_name: user.first_name,
        last_name: user.last_name,
        employee_id: user.employee_id,
      },
    });

    console.log(`${user.role.charAt(0).toUpperCase() + user.role.slice(1)}: ${user.email} / ${user.password}`);
  }

  console.log('✅ Sri Lankan full seed completed!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
