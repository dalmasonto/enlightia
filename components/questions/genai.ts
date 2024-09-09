import { GoogleGenerativeAI } from "@google/generative-ai";
const genAI = new GoogleGenerativeAI(process.env.NEXT_PUBLIC_GENAI!);

const model = genAI.getGenerativeModel({
    model: "gemini-1.5-flash",
    systemInstruction: `I want to use your model to generate questions that have single-choices and multichoices and each question to have points meaning you will need to generate answers for the questions and also questions which are open ended as below:\nRemember to return an array as your response. Don't add any text so as to make it easy for me to extract the array from the text.\nGenerate different questions which are either oe(Open-ended), sc(Single-choice) or mc(multichoice). For 'question' and 'answer' properties, use HTML to write them. Use the different elements available in HTML ie code for inline code and pre for a code block.\nFor 'pre' you can use highlight js classes like 'language-rust'. Each prompt has language, so use that.
    The HTML you write, make sure it is not executable on the DOM when rendering. Close the tags correctly.
    The result you return must only be json. Don't add any text before or after the square brackets.
    The questions you generate, try have some open ended, single choice or multichoice questions unless specified. And the questions and answers must be in the format given here.
    \nThis is how the output shoult look like (Points are numbers).:
    [
{
"question": "<p>What is HTML and why is it important for web development?</p>",
"question_type": "oe",
"options": [],
"points": 3
},
{
"question": "<p>What does HTML stand for?</p>",
"question_type": "sc",
"options": [
{
"answer": "<p>Hyperlink Text Markup Language</p>",
"is_correct": false
},
{
"answer": "<p>HyperText Markup Language</p>",
"is_correct": true
},
{
"answer": "<p>Home Tool Markup Language</p>",
"is_correct": false
},
{
"answer": "<p>Hyper Tool Markup Language</p>",
"is_correct": false
}
],
"points": 1
},
{
"question": "<p>Which of the following are true about HTML?</p>",
"question_type": "mc",
"options": [
{
"answer": "<p>It is used to structure web content</p>",
"is_correct": true
},
{
"answer": "<p>It is a programming language</p>",
"is_correct": false
},
{
"answer": "<p>HTML documents are saved with a .html extension</p>",
"is_correct": true
},
{
"answer": "<p>It is primarily used for server-side scripting</p>",
"is_correct": false
}
],
"points": 2
},
{
"question": "<p>Explain the basic structure of an HTML document.</p>",
"question_type": "oe",
"options": [],
"points": 4
},
{
"question": "<p>Which tag is used to specify a title for an HTML document?</p>",
"question_type": "sc",
"options": [
{
"answer": "<p><head></p>",
"is_correct": false
},
{
"answer": "<p><body></p>",
"is_correct": false
},
{
"answer": "<p><title></p>",
"is_correct": true
},
{
"answer": "<p><html></p>",
"is_correct": false
}
],
"points": 1
},
{
"question": "<p>What is the purpose of attributes in HTML elements?</p>",
"question_type": "oe",
"options": [],
"points": 3
},
{
"question": "<p>Which attribute is used to provide an alternative text for an image, if the image cannot be displayed?</p>",
"question_type": "sc",
"options": [
{
"answer": "<p>title</p>",
"is_correct": false
},
{
"answer": "<p>src</p>",
"is_correct": false
},
{
"answer": "<p>alt</p>",
"is_correct": true
},
{
"answer": "<p>href</p>",
"is_correct": false
}
],
"points": 1
},
{
"question": "<p>Which of the following are valid HTML attributes?</p>",
"question_type": "mc",
"options": [
{
"answer": "<p>class</p>",
"is_correct": true
},
{
"answer": "<p>style</p>",
"is_correct": true
},
{
"answer": "<p>id</p>",
"is_correct": true
},
{
"answer": "<p>text</p>",
"is_correct": false
}
],
"points": 2
},
{
"question": "<p>Describe the difference between block-level and inline elements with examples.</p>",
"question_type": "oe",
"options": [],
"points": 4
},
{
"question": "<p>Which tag is used to create a paragraph in HTML?</p>",
"question_type": "sc",
"options": [
{
"answer": "<p><paragraph></p>",
"is_correct": false
},
{
"answer": "<p><para></p>",
"is_correct": false
},
{
"answer": "<p><p></p>",
"is_correct": true
},
{
"answer": "<p><pg></p>",
"is_correct": false
}
],
"points": 1
},
{
"question": "<p>How do you create a hyperlink in HTML?</p>",
"question_type": "oe",
"options": [],
"points": 2
},
{
"question": "<p>Which tag is used to create an unordered list?</p>",
"question_type": "sc",
"options": [
{
"answer": "<p><ul></p>",
"is_correct": true
},
{
"answer": "<p><ol></p>",
"is_correct": false
},
{
"answer": "<p><li></p>",
"is_correct": false
},
{
"answer": "<p><list></p>",
"is_correct": false
}
],
"points": 1
},
{
"question": "<p>What are the possible values for the type attribute in an ordered list?</p>",
"question_type": "mc",
"options": [
{
"answer": "<p>1</p>",
"is_correct": true
},
{
"answer": "<p>A</p>",
"is_correct": true
},
{
"answer": "<p>a</p>",
"is_correct": true
},
{
"answer": "<p>i</p>",
"is_correct": true
}
],
"points": 2
},
{
"question": "<p>Explain the difference between ordered and unordered lists with examples.</p>",
"question_type": "oe",
"options": [],
"points": 3
},
{
"question": "<p>How do you create a list item in both ordered and unordered lists?</p>",
"question_type": "sc",
"options": [
{
"answer": "<p><item></p>",
"is_correct": false
},
{
"answer": "<p><list></p>",
"is_correct": false
},
{
"answer": "<p><li></p>",
"is_correct": true
},
{
"answer": "<p><ulitem></p>",
"is_correct": false
}
],
"points": 1
}
]
    `,
});

const prompt = "Write 15 questions with open ended, single choice and multi choice for Introduction to HTML: Building the Web. The topics to cover are Introduction to HTML, Elements and Attributes and Creating Links and Lists"

// const instructions = `
// I want to use your model to generate questions that have single-choices and multichoices meaning you will need to generate answers for the questions and also questions which are open ended as below:

// [
//   {
//     "question": "<p>Write question here</p>",
//     "question_type": "oe",
//     "options": []
//   },
//   {
//     "question": "<p>Write question here</p>",
//     "question_type": "sc",
//     "options": [
//       {
//         "answer": "<p>Write option here</p>",
//         "is_correct": true
//       },
//       {
//         "answer": "<p>Write option here</p>",
//         "is_correct": false
//       },
//       {
//         "answer": "<p>Write option here</p>",
//         "is_correct": false
//       },
//       {
//         "answer": "<p>Write option here</p>",
//         "is_correct": false
//       }
//     ]
//   },
//   {
//     "question": "<p>Write question here</p>",
//     "question_type": "mc",
//     "options": [
//       {
//         "answer": "<p>Write option here</p>",
//         "is_correct": false
//       },
//       {
//         "answer": "<p>Write option here</p>",
//         "is_correct": false
//       },
//       {
//         "answer": "<p>Write option here</p>",
//         "is_correct": true
//       },
//       {
//         "answer": "<p>Write option here</p>",
//         "is_correct": true
//       }
//     ]
//   }
// ]

// Remember to return an array as your response. Don't add any text so as to make it easy for me to extract the array from the text.
// Generate different questions which are either oe(Open-ended), sc(Single-choice) or mc(multichoice). For 'question' and 'answer' properties, use HTML to write them. Use the different elements available in HTML ie code for inline code and pre for a code block.
// For pre you can use highlight js classes.
// `

const generationConfig = {
    temperature: 1,
    topP: 0.95,
    topK: 64,
    maxOutputTokens: 8192,
    responseMimeType: "text/plain",
};

// async function createQuestions(topic: string) {
//     const prompt = `${topic}`

//     const result = await model.generateContent(prompt);
//     const response = result.response;
//     const text = response.text();
//     return text
// }

async function createQuestions(topic: string) {
    const chatSession = model.startChat({
        generationConfig,
        // safetySettings: Adjust safety settings
        // See https://ai.google.dev/gemini-api/docs/safety-settings
        history: [
        ],
    });

    const result = await chatSession.sendMessage(topic);
    return result.response.text()
}



export { createQuestions }