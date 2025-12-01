import { useState } from 'react'
import { Sparkles, Copy, Check, Wand2, AlertCircle } from 'lucide-react'

interface AIEventAssistantProps {
  onUseAI: () => void
  onManual: () => void
}

export function AIEventAssistant({ onUseAI, onManual }: AIEventAssistantProps) {
  const [copied, setCopied] = useState(false)

  const promptTemplate = `Create a comprehensive event listing with the following details:

Event Title: [Your Event Name]
Category: [Technology/Music/Food/Business/Sports/Arts]
Date: [YYYY-MM-DD]
Start Time: [HH:MM]
End Time: [HH:MM]
Location/Venue: [Venue Name]
Address: [Full Address]
Price: [Amount in KES or "Free"]
Capacity: [Number of attendees]

Based on the above information, generate:

1. SHORT DESCRIPTION (2-3 sentences for event listing)

2. LONG DESCRIPTION (HTML formatted with <p>, <h3>, <ul>, <li> tags):
   - Introduction paragraph
   - "What to Expect" section with 5+ bullet points
   - "Who Should Attend" section with 4+ bullet points

3. TAGS (5-7 relevant keywords, comma-separated)

4. EVENT FEATURES (6-8 items like "WiFi Available", "Parking", "Food Included")

5. EVENT SCHEDULE (6-8 time-based activities):
   Format: TIME | ACTIVITY
   Example: 09:00 AM | Registration & Welcome Coffee

6. FAQs (6-8 common questions with detailed answers):
   Format:
   Q: [Question]
   A: [Detailed Answer]

Please format the output clearly with sections labeled so I can easily copy and paste into the event creation form.`

  const handleCopy = async () => {
    await navigator.clipboard.writeText(promptTemplate)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-4xl w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-gradient-to-r from-purple-600 to-blue-600 text-white p-6 rounded-t-2xl">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Sparkles className="h-8 w-8" />
              <div>
                <h2 className="text-2xl font-bold">AI Event Creation Assistant</h2>
                <p className="text-purple-100 text-sm">Create comprehensive event details in seconds</p>
              </div>
            </div>
          </div>
        </div>

        <div className="p-6 space-y-6">
          {/* Choose Method */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <button
              onClick={onUseAI}
              className="group relative overflow-hidden bg-gradient-to-br from-purple-500 to-blue-600 text-white p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative z-10">
                <Wand2 className="h-12 w-12 mb-3 group-hover:rotate-12 transition-transform" />
                <h3 className="text-xl font-bold mb-2">AI-Assisted Creation</h3>
                <p className="text-sm text-purple-100">
                  Provide basic details and let AI generate descriptions, FAQs, schedule, and more
                </p>
              </div>
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>

            <button
              onClick={onManual}
              className="group relative overflow-hidden bg-gradient-to-br from-gray-600 to-gray-800 text-white p-6 rounded-xl hover:shadow-xl transition-all duration-300 hover:scale-105"
            >
              <div className="relative z-10">
                <AlertCircle className="h-12 w-12 mb-3 group-hover:scale-110 transition-transform" />
                <h3 className="text-xl font-bold mb-2">Manual Creation</h3>
                <p className="text-sm text-gray-100">
                  Fill in all event details manually using the step-by-step form
                </p>
              </div>
              <div className="absolute inset-0 bg-white/10 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300" />
            </button>
          </div>

          {/* Instructions */}
          <div className="bg-gradient-to-br from-blue-50 to-purple-50 border-2 border-purple-200 rounded-xl p-6">
            <h3 className="text-lg font-bold text-gray-900 mb-4 flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              How to Use AI Assistant
            </h3>
            <ol className="space-y-3 text-sm text-gray-700">
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">1</span>
                <span>Copy the prompt template below using the button</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">2</span>
                <span>Fill in your event's basic information in the template (name, date, location, price, etc.)</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">3</span>
                <span>Paste it into ChatGPT, Claude, or any AI assistant</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">4</span>
                <span>Copy the AI-generated content and paste it into the event form</span>
              </li>
              <li className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 bg-purple-600 text-white rounded-full flex items-center justify-center text-xs font-bold">5</span>
                <span>Review and adjust as needed before publishing</span>
              </li>
            </ol>
          </div>

          {/* Prompt Template */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <h3 className="text-lg font-bold text-gray-900">Prompt Template</h3>
              <button
                onClick={handleCopy}
                className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 transition-colors"
              >
                {copied ? (
                  <>
                    <Check className="h-4 w-4" />
                    Copied!
                  </>
                ) : (
                  <>
                    <Copy className="h-4 w-4" />
                    Copy Prompt
                  </>
                )}
              </button>
            </div>
            <div className="bg-gray-900 text-green-400 p-6 rounded-xl font-mono text-sm overflow-x-auto max-h-96 overflow-y-auto">
              <pre className="whitespace-pre-wrap">{promptTemplate}</pre>
            </div>
          </div>

          {/* Benefits */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="bg-white border-2 border-purple-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-purple-600 mb-2">10x</div>
              <div className="text-sm text-gray-600">Faster Event Creation</div>
            </div>
            <div className="bg-white border-2 border-blue-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-blue-600 mb-2">100%</div>
              <div className="text-sm text-gray-600">Professional Content</div>
            </div>
            <div className="bg-white border-2 border-green-200 rounded-lg p-4 text-center">
              <div className="text-3xl font-bold text-green-600 mb-2">0</div>
              <div className="text-sm text-gray-600">Writer's Block</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}