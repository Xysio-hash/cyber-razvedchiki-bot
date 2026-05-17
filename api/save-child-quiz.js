const { google } = require('googleapis');

// ID твоей Google Таблицы
const SPREADSHEET_ID = '1f3kxsnxOHxAlDWgnNUbiJ9cfS7BT2yjoonYM5TgVV5k';

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

module.exports = async (req, res) => {
    // CORS для VK Mini App
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
    
    if (req.method === 'OPTIONS') {
        return res.status(200).end();
    }
    
    if (req.method !== 'POST') {
        return res.status(405).json({ error: 'Только POST' });
    }
    
    try {
        const data = req.body;
        
        const row = [
            data.date || new Date().toLocaleString('ru-RU'),
            data.vk_id || '',
            data.parent_name || '',
            data.child_gender || '',
            data.child_age || '',
            data.tech_love || '',
            data.teamwork || '',
            data.competitive || '',
            data.activity || '',
            data.total_score || '',
            data.phone || '',
            data.consent_given ? 'Да' : ''
        ];
        
        await sheets.spreadsheets.values.append({
            spreadsheetId: SPREADSHEET_ID,
            range: 'Лист1!A:L',
            valueInputOption: 'USER_ENTERED',
            requestBody: { values: [row] }
        });
        
        console.log('✅ Данные записаны в Таблицу:', row[2], row[10]);
        res.json({ success: true, message: 'Данные сохранены' });
        
    } catch (error) {
        console.error('❌ Ошибка:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
};
