import React from 'react';
import { motion } from 'framer-motion';
import type { DigitalAnalysisReport } from '../../types';
import DigiBotChat from '../DigiBotChat';

// digiBot logo URL - with text included
const DIGIBOT_LOGO_WITH_TEXT = 'https://ctncspdgguclpeijikfp.supabase.co/storage/v1/object/public/Landing%20Page/dijibotkucuk.webp';

interface DigiBotTabProps {
  report: DigitalAnalysisReport;
  reportContext: string;
}

const DigiBotTab: React.FC<DigiBotTabProps> = ({ report, reportContext }) => {
  const analysisResult = report.analysis_result;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="h-[calc(100vh-200px)] min-h-[600px]"
    >
      <div className="bg-white rounded-2xl shadow-sm h-full overflow-hidden flex flex-col border border-gray-100">
        {/* Header */}
        <div className="relative bg-white border-b border-gray-100 px-6 py-4 flex items-center justify-center flex-shrink-0">
          <img 
            src={DIGIBOT_LOGO_WITH_TEXT}
            alt="digiBot"
            className="h-10 object-contain"
          />
          <div className="absolute right-6 flex items-center gap-1.5">
            <span className="w-1.5 h-1.5 bg-green-400 rounded-full animate-pulse"></span>
            <span className="text-[10px] text-gray-400">Çevrimiçi</span>
          </div>
        </div>

        {/* Chat Area */}
        <div className="flex-1 overflow-hidden">
          <DigiBotChat 
            reportId={report.id}
            reportContext={reportContext}
            viewerId={report.id}
            analysisResult={analysisResult}
            digitalScore={report.digital_score}
            companyName={report.company_name}
            isFullPage={true}
          />
        </div>
      </div>
    </motion.div>
  );
};

export default DigiBotTab;
