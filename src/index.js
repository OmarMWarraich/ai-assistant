import { ChatOpenAI } from "langchain/chat_models/openai"
import { PromptTemplate } from "langchain/prompts" 
import { StringOutputParser } from "langchain/schema/output_parser"
import { retriever } from "../utils/retriever";

document.addEventListener('submit', (e) => {
  e.preventDefault();
  /* eslint-disable-next-line */
  progressConversation();
});

const openAIApiKey = process.env.OPENAI_API_KEY;

const llm = new ChatOpenAI({ openAIApiKey });

const standAloneQuestionTemplate = 'Given a question, convert it into a standalone question.question: {question} standalone question:';

const standAloneQuestionPrompt = PromptTemplate.fromTemplate(standAloneQuestionTemplate);

const chain = standAloneQuestionPrompt.pipe(llm).pipe(new StringOutputParser()).pipe(retriever)

const response = await chain.invoke({
  question: 'What are the technical requirements for running scrimba? I have a very old laptop which is not that powerful.'
})

console.log(response)

async function progressConversation() {
  const userInput = document.getElementById('user-input');
  const chatbotConversation = document.getElementById('chatbot-conversation-container');
  const question = userInput.value;
  userInput.value = '';

  // add human message
  const newHumanSpeechBubble = document.createElement('div');
  newHumanSpeechBubble.classList.add('speech', 'speech-human');
  chatbotConversation.appendChild(newHumanSpeechBubble);
  newHumanSpeechBubble.textContent = question;
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;

  // add AI message
  const newAiSpeechBubble = document.createElement('div');
  newAiSpeechBubble.classList.add('speech', 'speech-ai');
  chatbotConversation.appendChild(newAiSpeechBubble);
  newAiSpeechBubble.textContent = result;
  chatbotConversation.scrollTop = chatbotConversation.scrollHeight;
}