const { PrismaClient } = require('@prisma/client');

async function checkUsers() {
  const prisma = new PrismaClient();
  
  try {
    console.log('🔍 Checking users in database...\n');
    
    // Get all users
    const users = await prisma.user.findMany({
      select: {
        id: true,
        firstName: true,
        lastName: true,
        email: true,
        plan: true,
        createdAt: true,
        stats: true
      },
      orderBy: {
        createdAt: 'desc'
      }
    });
    
    console.log(`📊 Total users: ${users.length}\n`);
    
    if (users.length === 0) {
      console.log('❌ No users found in database');
      return;
    }
    
    // Display users in a nice format
    users.forEach((user, index) => {
      console.log(`${index + 1}. ${user.firstName} ${user.lastName}`);
      console.log(`   📧 Email: ${user.email}`);
      console.log(`   📦 Plan: ${user.plan}`);
      console.log(`   📅 Created: ${new Date(user.createdAt).toLocaleString()}`);
      console.log(`   🆔 ID: ${user.id}`);
      console.log(`   📈 Interactions: ${user.stats.totalInteractions}`);
      console.log('');
    });
    
    // Summary by plan
    const planCounts = users.reduce((acc, user) => {
      acc[user.plan] = (acc[user.plan] || 0) + 1;
      return acc;
    }, {});
    
    console.log('📊 Summary by Plan:');
    Object.entries(planCounts).forEach(([plan, count]) => {
      console.log(`   ${plan}: ${count} users`);
    });
    
  } catch (error) {
    console.error('❌ Error checking users:', error);
  } finally {
    await prisma.$disconnect();
  }
}

checkUsers();
