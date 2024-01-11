import { RecursiveCharacterTextSplitter } from "langchain/text_splitter"
import { createClient } from '@supabase/supabase-js'
import { SupabaseVectorStore } from 'langchain/vectorstores/supabase'
import { OpenAIEmbeddings } from 'langchain/embeddings/openai'

try {
  const result = await fetch('../scrimba-info.txt')
  const text = await result.text()

  const splitter = new RecursiveCharacterTextSplitter({
    chunkSize: 500,
    separators: ['\n\n', '\n', ' ', ''],
    chunkOverlap: 50,
  })

  const output = await splitter.createDocuments([text])

  const sbApiKey = process.env.SUPABASE_API_KEY
  const sbUrl = process.env.SUPABASE_URL
  const openAIApiKey = process.env.OPENAI_API_KEY
  
  const client = createClient(sbUrl, sbApiKey)
    
    await SupabaseVectorStore.fromDocuments(
        output,
        new OpenAIEmbeddings({ openAIApiKey }),
        {
           client,
           tableName: 'documents',
        }
    )
} catch (error) {
  console.log(error)
}