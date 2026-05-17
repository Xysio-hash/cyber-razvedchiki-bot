const express = require('express');
const cors = require('cors');
const { google } = require('googleapis');
const path = require('path');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.static(path.join(__dirname)));

// ID твоей Google Таблицы
const SPREADSHEET_ID = '1XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX';

const auth = new google.auth.GoogleAuth({
    credentials: JSON.parse(process.env.GOOGLE_SERVICE_ACCOUNT_KEY || '{}'),
    scopes: ['https://www.googleapis.com/auth/spreadsheets']
});

const sheets = google.sheets({ version: 'v4', auth });

app.post('/save-child-quiz', async (req, res) => {
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
        console.error('❌ Ошибка записи в Таблицу:', error.message);
        res.status(500).json({ success: false, error: error.message });
    }
});

app.get('/', (req, res) => {
    res.send('✅ Сервер Лиги Киберразведчиков работает.');
});

app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
});
