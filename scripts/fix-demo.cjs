const fs = require('fs');
const path = require('path');

const filePath = path.join(__dirname, '..', 'src', 'pages', 'Demo.tsx');
const content = fs.readFileSync(filePath, 'utf-8');

const lines = content.split('\n');
console.log('Total lines:', lines.length);

// Find {/* Results Step */}
const startIndex = lines.findIndex(line => line.includes('{/* Results Step */}'));
console.log('Start marker found at line:', startIndex + 1);

if (startIndex === -1) {
  console.error('Could not find start marker!');
  process.exit(1);
}

// Find the end - look for the closing )} of the results step condition
// The pattern is:            </motion.div>
//           )}
// right before         </AnimatePresence>
let depth = 0;
let endIndex = -1;
let inResultsStep = false;

for (let i = startIndex; i < lines.length; i++) {
  const line = lines[i];
  
  // Once we enter the results step JSX expression
  if (line.includes('{currentStep === \'results\'')) {
    inResultsStep = true;
    depth = 1;
    continue;
  }
  
  if (inResultsStep) {
    // Count JSX expression brackets
    const opens = (line.match(/\{/g) || []).length;
    const closes = (line.match(/\}/g) || []).length;
    depth += opens - closes;
    
    // When we reach depth 0, we've closed the results step
    if (depth <= 0 && line.trim() === ')}') {
      endIndex = i;
      console.log('End found at line:', endIndex + 1);
      break;
    }
  }
}

if (endIndex === -1) {
  console.error('Could not find end marker!');
  process.exit(1);
}

const newResultsStep = `          {/* Results Step - V2 Dashboard */}
          {currentStep === 'results' && analysisResult && (
            <motion.div
              key="results"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="relative"
            >
              {/* Yeni Analiz Header */}
              <div className="fixed top-16 left-0 right-0 z-40 bg-white/95 dark:bg-gray-900/95 backdrop-blur-sm border-b border-gray-200 dark:border-gray-700">
                <div className="max-w-7xl mx-auto px-4 py-2 flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Building2 className="w-5 h-5 text-primary" />
                    <span className="font-medium text-gray-900 dark:text-white">{analysisResult.company_name}</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">• {analysisResult.sector}</span>
                  </div>
                  <button
                    onClick={() => {
                      setCurrentStep('form');
                      setAnalysisResult(null);
                      setFormData({ company_name: '', website_url: '', email: '' });
                      setChatMessages([]);
                      setIsChatOpen(false);
                    }}
                    className="flex items-center gap-2 px-4 py-2 bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors text-sm font-medium"
                  >
                    <RefreshCw className="w-4 h-4" />
                    Yeni Analiz
                  </button>
                </div>
              </div>
              
              {/* V2 Dashboard */}
              <div className="pt-16">
                <ReportDashboardV2 
                  report={convertToDigitalAnalysisReport(analysisResult, currentReportId || undefined)} 
                />
              </div>
            </motion.div>
          )}`;

const before = lines.slice(0, startIndex);
const after = lines.slice(endIndex + 1);

const newContent = [...before, newResultsStep, ...after].join('\n');

fs.writeFileSync(filePath, newContent, 'utf-8');
console.log('Done! New file has', newContent.split('\n').length, 'lines');
console.log('Removed lines:', lines.length - newContent.split('\n').length + newResultsStep.split('\n').length);
