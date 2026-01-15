import React from 'react';
import { FaGithub, FaLinkedin, FaTwitter, FaHeart } from 'react-icons/fa';
import { useTranslation } from 'react-i18next';

const Footer = () => {
  const { t } = useTranslation();
  
  return (
    <footer className="bg-gradient-to-r from-saffron-600 via-white to-spiritual-green mt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div className="col-span-1 md:col-span-2">
            <h3 className="text-2xl font-bold gradient-text mb-4">{t('hero.mainTitle')}</h3>
            <p className="text-gray-600 mb-4">
              {t('hero.tagline')}
            </p>
            <div className="flex space-x-4">
              <a href="#" className="text-gray-600 hover:text-saffron-600 transition-colors">
                <FaGithub size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-saffron-600 transition-colors">
                <FaLinkedin size={24} />
              </a>
              <a href="#" className="text-gray-600 hover:text-saffron-600 transition-colors">
                <FaTwitter size={24} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">{t('dashboard.quickAccess')}</h4>
            <ul className="space-y-2">
              <li><a href="/" className="text-gray-600 hover:text-saffron-600 transition-colors">{t('nav.home')}</a></li>
              <li><a href="/heatmap" className="text-gray-600 hover:text-saffron-600 transition-colors">{t('nav.heatmap')}</a></li>
              <li><a href="/safe-route" className="text-gray-600 hover:text-saffron-600 transition-colors">{t('nav.safeRoute')}</a></li>
              <li><a href="/prediction" className="text-gray-600 hover:text-saffron-600 transition-colors">{t('nav.predictions')}</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-bold text-gray-800 mb-4">{t('medical.helpline').split(':')[0]}</h4>
            <ul className="space-y-2 text-gray-600">
              <li>Police: 100</li>
              <li>Ambulance: 108</li>
              <li>Fire: 101</li>
              <li>Control Room: 1800-XXX-XXXX</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-300 mt-8 pt-8 text-center">
          <p className="text-gray-600">
            Made with <FaHeart className="inline text-red-500" /> for {t('hero.mainTitle')} 2025
          </p>
          <p className="text-gray-500 text-sm mt-2">
            © 2026 {t('hero.mainTitle')} {t('hero.mainSubtitle')}. {t('footer.rights')}.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
