import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Calendar, MapPin, Briefcase, Eye, Check, X, ExternalLink } from 'lucide-react';
import type { FreelancerApplication } from '../types';

interface FreelancerListProps {
  freelancers: FreelancerApplication[];
  onView: (freelancer: FreelancerApplication) => void;
  onUpdateStatus: (id: string, status: FreelancerApplication['status']) => void;
}

const FreelancerList = ({ freelancers, onView, onUpdateStatus }: FreelancerListProps) => {
  const getStatusColor = (status: FreelancerApplication['status']) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-500/10 text-yellow-500';
      case 'reviewing':
        return 'bg-blue-500/10 text-blue-500';
      case 'accepted':
        return 'bg-green-500/10 text-green-500';
      case 'rejected':
        return 'bg-red-500/10 text-red-500';
      default:
        return 'bg-gray-500/10 text-gray-500';
    }
  };

  const getStatusText = (status: FreelancerApplication['status']) => {
    switch (status) {
      case 'pending':
        return 'Bekliyor';
      case 'reviewing':
        return 'İnceleniyor';
      case 'accepted':
        return 'Kabul Edildi';
      case 'rejected':
        return 'Reddedildi';
      default:
        return status;
    }
  };

  return (
    <div className="bg-white dark:bg-dark-light border border-slate-200 dark:border-white/10 rounded-xl overflow-hidden">
      <div className="overflow-x-auto">
        <table className="w-full text-slate-900 dark:text-white">
          <thead>
            <tr className="border-b border-slate-200 dark:border-white/10">
              <th className="text-left py-4 px-6 font-medium">Başvuran</th>
              <th className="text-left py-4 px-6 font-medium">Uzmanlık</th>
              <th className="text-left py-4 px-6 font-medium hidden lg:table-cell">Konum</th>
              <th className="text-left py-4 px-6 font-medium hidden md:table-cell">Başvuru Tarihi</th>
              <th className="text-left py-4 px-6 font-medium">Durum</th>
              <th className="text-right py-4 px-6 font-medium">İşlemler</th>
            </tr>
          </thead>
          <tbody>
            {freelancers.map((freelancer) => (
              <motion.tr
                key={freelancer.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="border-b border-slate-100 dark:border-white/5 hover:bg-slate-50 dark:hover:bg-white/5 transition-colors"
              >
                <td className="py-4 px-6">
                  <Link to={`/admin/freelancers/${freelancer.id}`} className="block hover:text-primary transition-colors">
                    <h4 className="font-medium">{freelancer.full_name}</h4>
                    <p className="text-sm text-slate-500 dark:text-gray-400">{freelancer.email}</p>
                  </Link>
                </td>
                <td className="py-4 px-6">
                  <div className="flex flex-wrap gap-2">
                    {freelancer.main_expertise.slice(0, 2).map((expertise, index) => (
                      <span
                        key={index}
                        className="px-2 py-1 bg-primary/10 text-primary rounded-full text-xs"
                      >
                        {expertise}
                      </span>
                    ))}
                    {freelancer.main_expertise.length > 2 && (
                      <span className="text-slate-500 dark:text-gray-400 text-xs">
                        +{freelancer.main_expertise.length - 2}
                      </span>
                    )}
                  </div>
                </td>
                <td className="py-4 px-6 hidden lg:table-cell">
                  <div className="flex items-center text-slate-500 dark:text-gray-400">
                    <MapPin className="w-4 h-4 mr-1" />
                    {freelancer.location}
                  </div>
                </td>
                <td className="py-4 px-6 hidden md:table-cell">
                  <div className="flex items-center text-slate-500 dark:text-gray-400">
                    <Calendar className="w-4 h-4 mr-1" />
                    {new Date(freelancer.created_at).toLocaleDateString('tr-TR')}
                  </div>
                </td>
                <td className="py-4 px-6">
                  <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(freelancer.status)}`}>
                    {getStatusText(freelancer.status)}
                  </span>
                </td>
                <td className="py-4 px-6 text-right">
                  <div className="flex items-center justify-end space-x-2">
                    <Link
                      to={`/admin/freelancers/${freelancer.id}`}
                      className="p-2 hover:bg-slate-100 dark:hover:bg-white/10 rounded-lg transition-colors text-slate-500 dark:text-gray-400 hover:text-slate-900 dark:hover:text-white"
                      title="Detayları Görüntüle"
                    >
                      <Eye className="w-4 h-4" />
                    </Link>
                    {freelancer.status === 'pending' && (
                      <>
                        <button
                          onClick={() => onUpdateStatus(freelancer.id, 'accepted')}
                          className="p-2 hover:bg-green-500/10 text-green-500 rounded-lg transition-colors"
                          title="Kabul Et"
                        >
                          <Check className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => onUpdateStatus(freelancer.id, 'rejected')}
                          className="p-2 hover:bg-red-500/10 text-red-500 rounded-lg transition-colors"
                          title="Reddet"
                        >
                          <X className="w-4 h-4" />
                        </button>
                      </>
                    )}
                    {freelancer.cv_url && (
                      <a
                        href={freelancer.cv_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="p-2 hover:bg-primary/10 text-primary rounded-lg transition-colors"
                        title="CV'yi Görüntüle"
                      >
                        <ExternalLink className="w-4 h-4" />
                      </a>
                    )}
                  </div>
                </td>
              </motion.tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default FreelancerList;