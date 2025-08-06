import { PrismaClient } from '@prisma/client';
import { hashPassword } from './utils/auth';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Seeding database...');

  // Admin-Benutzer erstellen (Paul - Organisator)
  const adminPasswordHash = await hashPassword('admin123');
  const admin = await prisma.user.upsert({
    where: { email: 'paul@huettenapp.de' },
    update: {},
    create: {
      name: 'Paul',
      email: 'paul@huettenapp.de',
      passwordHash: adminPasswordHash,
      role: "ADMIN",
      hasPaid: true
    }
  });

  // Test-Teilnehmer erstellen  
  const participantPasswordHash = await hashPassword('password123');
  const participants = await Promise.all([
    prisma.user.upsert({
      where: { email: 'felix@example.com' },
      update: {},
      create: {
        name: 'Felix',
        email: 'felix@example.com',
        passwordHash: participantPasswordHash,
        role: "PARTICIPANT",
        hasPaid: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'morten@example.com' },
      update: {},
      create: {
        name: 'Morten',
        email: 'morten@example.com',
        passwordHash: participantPasswordHash,
        role: "PARTICIPANT",
        hasPaid: false
      }
    }),
    prisma.user.upsert({
      where: { email: 'jessi@example.com' },
      update: {},
      create: {
        name: 'Jessi',
        email: 'jessi@example.com',
        passwordHash: participantPasswordHash,
        role: "PARTICIPANT",
        hasPaid: true
      }
    }),
    prisma.user.upsert({
      where: { email: 'leo@example.com' },
      update: {},
      create: {
        name: 'Leo',
        email: 'leo@example.com',
        passwordHash: participantPasswordHash,
        role: "PARTICIPANT",
        hasPaid: false
      }
    }),
    prisma.user.upsert({
      where: { email: 'jose@example.com' },
      update: {},
      create: {
        name: 'Jose',
        email: 'jose@example.com',
        passwordHash: participantPasswordHash,
        role: "PARTICIPANT",
        hasPaid: true
      }
    })
  ]);

  // Test-Aktivitäten für Gabnalm 2025 erstellen
  const huettenDate = new Date('2025-06-04'); // 04.06.2025
  const mittwoch = new Date(huettenDate);
  const donnerstag = new Date(huettenDate.getTime() + 24 * 60 * 60 * 1000);
  const freitag = new Date(huettenDate.getTime() + 2 * 24 * 60 * 60 * 1000);
  const samstag = new Date(huettenDate.getTime() + 3 * 24 * 60 * 60 * 1000);

  const activities = await Promise.all([
    prisma.activity.create({
      data: {
        title: 'Anreise und Ankunft',
        description: 'Treffpunkt Volksfestplatz Grafing um 13:00 Uhr, dann gemeinsame Fahrt zur Gabnalm',
        startTime: new Date(mittwoch.getTime() + 13 * 60 * 60 * 1000), // 13:00 Uhr
        endTime: new Date(mittwoch.getTime() + 17 * 60 * 60 * 1000), // 17:00 Uhr
        location: 'Volksfestplatz Grafing → Gabnalm',
        createdBy: admin.id
      }
    }),
    prisma.activity.create({
      data: {
        title: 'Grillen - Kochgruppe 1',
        description: 'Gemütlicher Grillabend zur Ankunft mit Paul und Felix',
        startTime: new Date(mittwoch.getTime() + 19 * 60 * 60 * 1000), // 19:00 Uhr
        endTime: new Date(mittwoch.getTime() + 22 * 60 * 60 * 1000), // 22:00 Uhr
        location: 'Gabnalm Terrasse',
        createdBy: admin.id
      }
    }),
    prisma.activity.create({
      data: {
        title: 'Beerpong-Turnier Tag 1',
        description: 'Erstes Beerpong-Turnier - Anmeldung vor Ort mit Teamnamen',
        startTime: new Date(freitag.getTime() + 20 * 60 * 60 * 1000), // 20:00 Uhr
        endTime: new Date(freitag.getTime() + 23 * 60 * 60 * 1000), // 23:00 Uhr
        location: 'Gabnalm Hauptraum',
        createdBy: admin.id
      }
    }),
    prisma.activity.create({
      data: {
        title: 'Beerpong-Turnier Finale',
        description: 'Finales Beerpong-Turnier mit Siegerehrung',
        startTime: new Date(samstag.getTime() + 20 * 60 * 60 * 1000), // 20:00 Uhr
        endTime: new Date(samstag.getTime() + 23 * 60 * 60 * 1000), // 23:00 Uhr
        location: 'Gabnalm Hauptraum',
        createdBy: admin.id
      }
    }),
    prisma.activity.create({
      data: {
        title: 'Ausflug zum Walchensee',
        description: 'Gemeinsamer Ausflug zum wunderschönen Walchensee mit Baden und Entspannung',
        startTime: new Date(donnerstag.getTime() + 10 * 60 * 60 * 1000), // 10:00 Uhr
        endTime: new Date(donnerstag.getTime() + 16 * 60 * 60 * 1000), // 16:00 Uhr
        location: 'Walchensee',
        createdBy: admin.id
      }
    }),
    prisma.activity.create({
      data: {
        title: 'Wanderung zum Zahmen Kaiser',
        description: 'Anspruchsvollere Wanderung für die fittere Truppe übern Zahmen Kaiser',
        startTime: new Date(freitag.getTime() + 9 * 60 * 60 * 1000), // 9:00 Uhr
        endTime: new Date(freitag.getTime() + 17 * 60 * 60 * 1000), // 17:00 Uhr
        location: 'Zahmer Kaiser',
        createdBy: admin.id
      }
    })
  ]);

  // Test-Benachrichtigungen erstellen
  await Promise.all(
    participants.map(participant =>
      prisma.notification.create({
        data: {
          userId: participant.id,
          title: 'Willkommen im Hüttenurlaub!',
          body: 'Herzlich willkommen! Wir freuen uns auf eine tolle Zeit zusammen. Vergiss nicht, deine Wanderschuhe mitzubringen!'
        }
      })
    )
  );

  console.log('✅ Database seeded successfully!');
  console.log('\n📝 Test-Accounts für Gabnalm 2025:');
  console.log('👤 Admin: paul@huettenapp.de / admin123 (Organisator)');
  console.log('👤 Felix: felix@example.com / password123 (bezahlt)');
  console.log('👤 Morten: morten@example.com / password123 (nicht bezahlt)');
  console.log('👤 Jessi: jessi@example.com / password123 (bezahlt)');
  console.log('👤 Leo: leo@example.com / password123 (nicht bezahlt)');
  console.log('👤 Jose: jose@example.com / password123 (bezahlt)');
  console.log(`\n🎯 ${activities.length} Aktivitäten für Gabnalm erstellt`);
  console.log(`📧 ${participants.length} Benachrichtigungen erstellt`);
}

main()
  .catch((e) => {
    console.error('❌ Seed failed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });