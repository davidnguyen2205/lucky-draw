import process from 'node:process'
import pool from './connection.js'

// Default session ID for demo data
const DEMO_SESSION_ID = 'demo-session-default'

// Default person data (converted from TypeScript)
const defaultPersonList = [
  {
    uid: 'U100156001',
    name: 'John Smith',
    department: 'Executive',
    identity: 'CEO',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 1,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156002',
    name: 'Michael Johnson',
    department: 'Executive',
    identity: 'President',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 2,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156003',
    name: 'David Williams',
    department: 'Executive',
    identity: 'Vice President',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 3,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156004',
    name: 'Robert Brown',
    department: 'Management',
    identity: 'Director',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 4,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156005',
    name: 'William Davis',
    department: 'Management',
    identity: 'Assistant Director',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 5,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156006',
    name: 'James Miller',
    department: 'Management',
    identity: 'Manager',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 6,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156007',
    name: 'Christopher Wilson',
    department: 'Management',
    identity: 'Senior Manager',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 7,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156008',
    name: 'Daniel Moore',
    department: 'Management',
    identity: 'Team Lead',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 8,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156009',
    name: 'Matthew Taylor',
    department: 'Staff',
    identity: 'Supervisor',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 9,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156010',
    name: 'Anthony Anderson',
    department: 'Staff',
    identity: 'Senior Employee',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 10,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156011',
    name: 'Mark Thomas',
    department: 'Staff',
    identity: 'Administrator',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 11,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156012',
    name: 'Steven Jackson',
    department: 'Staff',
    identity: 'Coordinator',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 12,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156013',
    name: 'Paul White',
    department: 'Staff',
    identity: 'Officer',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 13,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156014',
    name: 'Joshua Harris',
    department: 'Staff',
    identity: 'Specialist',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 14,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156015',
    name: 'Kenneth Martin',
    department: 'Staff',
    identity: 'Representative',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 15,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156016',
    name: 'Kevin Thompson',
    department: 'Staff',
    identity: 'Associate',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 16,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156017',
    name: 'Brian Garcia',
    department: 'Staff',
    identity: 'Assistant',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 17,
    y: 1,
    isWin: false,
  },
  {
    uid: 'U100156018',
    name: 'George Martinez',
    department: 'Support',
    identity: 'Security Officer',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 1,
    y: 2,
    isWin: false,
  },
  {
    uid: 'U100156019',
    name: 'Edward Robinson',
    department: 'Support',
    identity: 'Communications Officer',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 2,
    y: 2,
    isWin: false,
  },
  {
    uid: 'U100156020',
    name: 'Ronald Clark',
    department: 'Support',
    identity: 'Operations Manager',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 3,
    y: 2,
    isWin: false,
  },
  // Adding more key representatives for demo
  {
    uid: 'U100156021',
    name: 'Timothy Rodriguez',
    department: 'Support',
    identity: 'Deputy Manager',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 4,
    y: 2,
    isWin: false,
  },
  {
    uid: 'U100156022',
    name: 'Jason Lewis',
    department: 'Support',
    identity: 'Quality Control',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 5,
    y: 2,
    isWin: false,
  },
  {
    uid: 'U100156023',
    name: 'Jeffrey Lee',
    department: 'Support',
    identity: 'Inspector',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 6,
    y: 2,
    isWin: false,
  },
  {
    uid: 'U100156024',
    name: 'Ryan Walker',
    department: 'Support',
    identity: 'Investigator',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 7,
    y: 2,
    isWin: false,
  },
  {
    uid: 'U100156025',
    name: 'Jacob Hall',
    department: 'Support',
    identity: 'Guard',
    avatar: 'https://img1.baidu.com/it/u=2165937980,813753762&fm=253&fmt=auto&app=138&f=JPEG?w=500&h=500',
    x: 8,
    y: 2,
    isWin: false,
  },
]

// Default prize data (converted from TypeScript)
const defaultPrizeList = [
  {
    id: '001',
    name: 'Third Prize',
    sort: 1,
    isAll: false,
    count: 3,
    isUsedCount: 0,
    picture: {
      id: '2',
      name: 'Third Prize',
      url: 'https://1kw20.fun/resource/image/image3.png',
    },
    separateCount: {
      enable: true,
      countList: [],
    },
    desc: 'Third Prize',
    isShow: true,
    isUsed: false,
    frequency: 1,
  },
  {
    id: '002',
    name: 'Second Prize',
    sort: 2,
    isAll: false,
    count: 2,
    isUsedCount: 0,
    picture: {
      id: '1',
      name: 'Second Prize',
      url: 'https://1kw20.fun/resource/image/image2.png',
    },
    separateCount: {
      enable: false,
      countList: [],
    },
    desc: 'Second Prize',
    isShow: true,
    isUsed: false,
    frequency: 1,
  },
  {
    id: '003',
    name: 'First Prize',
    sort: 3,
    isAll: false,
    count: 1,
    isUsedCount: 0,
    picture: {
      id: '0',
      name: 'First Prize',
      url: 'https://1kw20.fun/resource/image/image1.png',
    },
    separateCount: {
      enable: false,
      countList: [],
    },
    desc: 'First Prize',
    isShow: true,
    isUsed: false,
    frequency: 1,
  },
  {
    id: '004',
    name: 'Grand Prize',
    sort: 4,
    isAll: false,
    count: 1,
    isUsedCount: 0,
    picture: {
      id: '3',
      name: 'Grand Prize',
      url: 'https://1kw20.fun/resource/image/image4.png',
    },
    separateCount: {
      enable: false,
      countList: [],
    },
    desc: 'Grand Prize',
    isShow: true,
    isUsed: false,
    frequency: 1,
  },
  {
    id: '005',
    name: 'Special Prize',
    sort: 5,
    isAll: false,
    count: 1,
    isUsedCount: 0,
    picture: {
      id: '4',
      name: 'Special Prize',
      url: 'https://1kw20.fun/resource/image/image5.png',
    },
    separateCount: {
      enable: false,
      countList: [],
    },
    desc: 'Special Prize',
    isShow: true,
    isUsed: false,
    frequency: 1,
  },
]

// Default music configuration
const defaultMusicConfig = {
  musicList: [
    {
      id: 'music-1',
      name: 'Geoff Knorr - China (The Industrial Era).ogg',
      url: 'https://1kw20.fun/resource/audio/Geoff Knorr - China (The Industrial Era).ogg',
    },
    {
      id: 'music-2',
      name: 'Radetzky March.mp3',
      url: 'https://1kw20.fun/resource/audio/Radetzky March.mp3',
    },
    {
      id: 'music-3',
      name: 'Shanghai.mp3',
      url: 'https://1kw20.fun/resource/audio/Shanghai.mp3',
    },
  ],
  currentMusic: {
    id: 'music-1',
    name: 'Geoff Knorr - China (The Industrial Era).ogg',
    url: 'https://1kw20.fun/resource/audio/Geoff Knorr - China (The Industrial Era).ogg',
  },
  volume: 0.5,
  autoPlay: true,
}

// Default global configuration
const defaultGlobalConfig = {
  title: 'Lucky Draw System',
  showTitle: true,
  backgroundImage: '',
  backgroundColor: '#1a1a2e',
  fontColor: '#ffffff',
  pattern: [21, 38, 55, 54, 53, 70, 87, 88, 89, 23, 40, 57, 74, 91, 92, 93, 76, 59, 42, 25, 24, 27, 28, 29, 46, 63, 62, 61, 78, 95, 96, 97, 20, 19, 31, 48, 65, 66, 67, 84, 101, 100, 99, 32, 33],
}

async function importData() {
  const client = await pool.connect()
  
  try {
    await client.query('BEGIN')
    console.error('🚀 Starting data import...')

    // 1. Create demo user session
    console.error('📝 Creating demo session...')
    await client.query(
      'INSERT INTO users (session_id) VALUES ($1) ON CONFLICT (session_id) DO NOTHING',
      [DEMO_SESSION_ID],
    )

    // 2. Clear existing demo data
    console.error('🧹 Clearing existing demo data...')
    await client.query('DELETE FROM lottery_results WHERE user_session_id = $1', [DEMO_SESSION_ID])
    await client.query('DELETE FROM persons WHERE user_session_id = $1', [DEMO_SESSION_ID])
    await client.query('DELETE FROM prizes WHERE user_session_id = $1', [DEMO_SESSION_ID])
    await client.query('DELETE FROM global_configs WHERE user_session_id = $1', [DEMO_SESSION_ID])

    // 3. Import persons
    console.error('👥 Importing persons...')
    for (const person of defaultPersonList) {
      await client.query(`
        INSERT INTO persons (uid, name, department, identity, avatar, x, y, is_win, user_session_id)
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9)
        ON CONFLICT (uid) DO UPDATE SET
          name = EXCLUDED.name,
          department = EXCLUDED.department,
          identity = EXCLUDED.identity,
          avatar = EXCLUDED.avatar,
          x = EXCLUDED.x,
          y = EXCLUDED.y,
          is_win = EXCLUDED.is_win,
          user_session_id = EXCLUDED.user_session_id,
          updated_at = CURRENT_TIMESTAMP
      `, [
        person.uid,
        person.name,
        person.department,
        person.identity,
        person.avatar,
        person.x,
        person.y,
        person.isWin,
        DEMO_SESSION_ID,
      ])
    }

    // 4. Import prizes
    console.error('🏆 Importing prizes...')
    for (const prize of defaultPrizeList) {
      await client.query(`
        INSERT INTO prizes (
          id, name, sort_order, is_all, count, is_used_count,
          picture_id, picture_name, picture_url,
          separate_count_enable, separate_count_list,
          description, is_show, is_used, frequency, user_session_id
        ) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        ON CONFLICT (id) DO UPDATE SET
          name = EXCLUDED.name,
          sort_order = EXCLUDED.sort_order,
          is_all = EXCLUDED.is_all,
          count = EXCLUDED.count,
          is_used_count = EXCLUDED.is_used_count,
          picture_id = EXCLUDED.picture_id,
          picture_name = EXCLUDED.picture_name,
          picture_url = EXCLUDED.picture_url,
          separate_count_enable = EXCLUDED.separate_count_enable,
          separate_count_list = EXCLUDED.separate_count_list,
          description = EXCLUDED.description,
          is_show = EXCLUDED.is_show,
          is_used = EXCLUDED.is_used,
          frequency = EXCLUDED.frequency,
          user_session_id = EXCLUDED.user_session_id,
          updated_at = CURRENT_TIMESTAMP
      `, [
        prize.id,
        prize.name,
        prize.sort,
        prize.isAll,
        prize.count,
        prize.isUsedCount,
        prize.picture.id,
        prize.picture.name,
        prize.picture.url,
        prize.separateCount.enable,
        JSON.stringify(prize.separateCount.countList),
        prize.desc,
        prize.isShow,
        prize.isUsed,
        prize.frequency,
        DEMO_SESSION_ID,
      ])
    }

    // 5. Import global configurations
    console.error('⚙️  Importing global configurations...')
    
    // Music configuration
    await client.query(`
      INSERT INTO global_configs (config_key, config_value, user_session_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (config_key, user_session_id) DO UPDATE SET
        config_value = EXCLUDED.config_value,
        updated_at = CURRENT_TIMESTAMP
    `, ['musicConfig', JSON.stringify(defaultMusicConfig), DEMO_SESSION_ID])

    // Global configuration
    await client.query(`
      INSERT INTO global_configs (config_key, config_value, user_session_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (config_key, user_session_id) DO UPDATE SET
        config_value = EXCLUDED.config_value,
        updated_at = CURRENT_TIMESTAMP
    `, ['globalConfig', JSON.stringify(defaultGlobalConfig), DEMO_SESSION_ID])

    // Image list configuration
    const defaultImageList = [
      { id: '0', name: 'First Prize', url: 'https://1kw20.fun/resource/image/image1.png' },
      { id: '1', name: 'Second Prize', url: 'https://1kw20.fun/resource/image/image2.png' },
      { id: '2', name: 'Third Prize', url: 'https://1kw20.fun/resource/image/image3.png' },
      { id: '3', name: 'Grand Prize', url: 'https://1kw20.fun/resource/image/image4.png' },
      { id: '4', name: 'Special Prize', url: 'https://1kw20.fun/resource/image/image5.png' },
    ]
    
    await client.query(`
      INSERT INTO global_configs (config_key, config_value, user_session_id)
      VALUES ($1, $2, $3)
      ON CONFLICT (config_key, user_session_id) DO UPDATE SET
        config_value = EXCLUDED.config_value,
        updated_at = CURRENT_TIMESTAMP
    `, ['imageList', JSON.stringify(defaultImageList), DEMO_SESSION_ID])

    await client.query('COMMIT')
    
    console.error('✅ Data import completed successfully!')
    console.error(`📊 Imported:`)
    console.error(`   - ${defaultPersonList.length} persons`)
    console.error(`   - ${defaultPrizeList.length} prizes`)
    console.error(`   - 3 global configurations`)
    console.error(`🎯 Demo session ID: ${DEMO_SESSION_ID}`)
    console.error(`💡 Use this session ID in your frontend or API calls to access the demo data.`)
    
  }
  catch (error) {
    await client.query('ROLLBACK')
    console.error('❌ Data import failed:', error)
    throw error
  }
  finally {
    client.release()
  }
}

// Run import if this file is executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  importData()
    .then(() => {
      console.error('🎉 Import process completed')
      process.exit(0)
    })
    .catch((error) => {
      console.error('💥 Import process failed:', error)
      process.exit(1)
    })
}

export default importData
