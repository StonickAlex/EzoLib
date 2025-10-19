const fs = require('fs');
const path = require('path');
const {
    execSync
} = require('child_process');

// Функция для очистки текста от проблемных символов
function cleanText(text) {
    return text
        // Убираем все символы, которые могут вызвать проблемы в MDX
        .replace(/[{}]/g, '') // Убираем фигурные скобки
        .replace(/\[([^\]]*)\]{\.underline\}/g, '$1') // Убираем подчеркивание
        .replace(/\{[^}]*\}/g, '') // Убираем все фигурные скобки с содержимым
        .replace(/<!--[\s\S]*?-->/g, '') // Удаляем HTML комментарии
        .replace(/\\\*/g, '*') // Исправляем экранированные звездочки
        .replace(/\\\./g, '.') // Исправляем экранированные точки
        .replace(/\\\,/g, ',') // Исправляем экранированные запятые
        .replace(/\\\"/g, '"') // Исправляем экранированные кавычки
        .replace(/\\\'/g, "'") // Исправляем экранированные апострофы
        .replace(/\n{3,}/g, '\n\n') // Убираем лишние переносы строк
        .trim();
}

// Функция для конвертации docx в markdown
function convertDocxToMarkdown(docxPath) {
    try {
        const command = `pandoc "${docxPath}" -t markdown --wrap=none`;
        const markdown = execSync(command, {
            encoding: 'utf8'
        });
        return cleanText(markdown);
    } catch (error) {
        console.error(`❌ Ошибка конвертации ${docxPath}:`, error.message);
        return null;
    }
}

// Функция для создания MDX страницы
function createMdxPage(folderName, title, description) {
    try {
        const knowLadgePath = path.join(__dirname, 'KnowLadge', folderName);
        const docsPath = path.join(__dirname, 'src', 'app', 'docs');

        // Маппинг папок
        const folderMapping = {
            'Таро': 'tarot',
            'Нумерология': 'numerology',
            'Обряды': 'rites',
            'Основы магии': 'magic-basics',
            'Психосоматика': 'psychosomatics',
            'Стрим': 'stream',
            'Схема разговора': 'conversation-schema',
            'Магическая работа с возражениями': 'arguments',
            'Astrology ': 'astrology'
        };

        const url = folderMapping[folderName];
        if (!url) {
            console.log(`❌ Папка "${folderName}" не найдена в маппинге`);
            return;
        }

        if (!fs.existsSync(knowLadgePath)) {
            console.log(`❌ Папка "${folderName}" не существует в KnowLadge`);
            return;
        }

        // Читаем все файлы в папке
        const files = fs.readdirSync(knowLadgePath);
        const docxFiles = files.filter(file => file.endsWith('.docx'));

        if (docxFiles.length === 0) {
            console.log(`⚠️  В папке ${folderName} нет .docx файлов`);
            return;
        }

        // Конвертируем все docx файлы
        let combinedContent = '';
        for (const docxFile of docxFiles) {
            const docxPath = path.join(knowLadgePath, docxFile);
            console.log(`📄 Конвертируем: ${docxFile}`);

            const markdown = convertDocxToMarkdown(docxPath);
            if (markdown) {
                const fileName = docxFile.replace('.docx', '');
                combinedContent += `\n\n## ${fileName}\n\n${markdown}\n\n`;
            }
        }

        if (!combinedContent.trim()) {
            console.log(`❌ Не удалось конвертировать файлы в папке ${folderName}`);
            return;
        }

        // Создаем MDX контент без frontmatter
        const mdxContent = combinedContent;

        // Создаем директорию и файл
        const mdxPath = path.join(docsPath, url, 'page.mdx');
        const outputDir = path.dirname(mdxPath);

        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir, {
                recursive: true
            });
        }

        fs.writeFileSync(mdxPath, mdxContent);
        console.log(`✅ Создана MDX страница: ${mdxPath}`);

    } catch (error) {
        console.error(`❌ Ошибка создания MDX для ${folderName}:`, error.message);
    }
}

// Основная функция
function main() {
    const folderName = process.argv[2];

    if (!folderName) {
        console.log('Использование: node convert-clean.js <название_папки>');
        console.log('Доступные папки:');
        console.log('- Таро');
        console.log('- Нумерология');
        console.log('- Обряды');
        console.log('- Основы магии');
        console.log('- Психосоматика');
        console.log('- Стрим');
        console.log('- Схема разговора');
        console.log('- Магическая работа с возражениями');
        return;
    }

    console.log(`🚀 Конвертируем папку: ${folderName}\n`);

    // Определяем заголовок и описание
    const titles = {
        'Таро': 'Таро - Magic Lab',
        'Нумерология': 'Нумерология - Magic Lab',
        'Обряды': 'Обряды - Magic Lab',
        'Основы магии': 'Основы магии - Magic Lab',
        'Психосоматика': 'Психосоматика - Magic Lab',
        'Стрим': 'Стрим - Magic Lab',
        'Схема разговора': 'Схема разговора - Magic Lab',
        'Магическая работа с возражениями': 'Магическая работа с возражениями - Magic Lab'
    };

    const descriptions = {
        'Таро': 'Искусство гадания на картах Таро и их интерпретация',
        'Нумерология': 'Работа с числами, датами рождения и их влиянием на судьбу человека',
        'Обряды': 'Магические обряды и ритуалы',
        'Основы магии': 'Изучение базовых принципов магических практик, элементов и любовной магии',
        'Психосоматика': 'Связь психики и тела в эзотерической практике',
        'Стрим': 'Прямые трансляции и онлайн практики',
        'Схема разговора': 'Структура и техники ведения разговоров с клиентами',
        'Магическая работа с возражениями': 'Руководство по работе с возражениями клиентов в эзотерической практике'
    };

    const title = titles[folderName] || `${folderName} - Magic Lab`;
    const description = descriptions[folderName] || `Материалы по ${folderName.toLowerCase()}`;

    createMdxPage(folderName, title, description);

    console.log(`\n🎉 Конвертация папки "${folderName}" завершена!`);
}

// Запускаем скрипт
main();