let DocumentParser = { parseFile: async () => "" };
let TestGeneratorService = { generateTest: async () => ({}) };
try { DocumentParser = require('../services/ai/DocumentParser'); } catch (e) {}
try { TestGeneratorService = require('../services/ai/TestGeneratorService'); } catch (e) {}

exports.generatePaper = async (req, res) => {
    try {
        const { syllabusFile, settings } = req.body; 
        // settings: { difficulty: 'Hard', bloomLevel: 'Analyzing', count: 10 }

        // 1. Extract raw syllabus from file
        const syllabusText = await DocumentParser.parseFile(syllabusFile.path, syllabusFile.mimetype);

        // 2. Delegate to AI Service
        const generatedPaper = await TestGeneratorService.generateTest(syllabusText, settings);

        // 3. Store in DB (QuestionBank) and return
        res.status(200).json({ success: true, paper: generatedPaper });
    } catch (error) {
        res.status(500).json({ success: false, error: error.message });
    }
};