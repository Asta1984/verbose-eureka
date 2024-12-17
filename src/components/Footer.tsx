import { FC } from 'react';
import { motion } from 'framer-motion';
import { 
  Wallet, 
  GitMerge, 
  Shield, 
  Globe, 
  Zap, 
  Twitter, 
  Github, 
  Linkedin 
} from 'lucide-react';

// Font styling utility
const fontStyles = {
  heading: "font-[OnlinePrivileges] text-lg font-semibold text-purple-300",
  body: "font-[Type_writer] text-gray-400",
  link: "font-[Type_writer] text-gray-300 hover:text-purple-300 transition-colors duration-300",
  copyright: "font-[Type_writer] text-gray-500"
};

const Footer: FC = () => {
  return (
    <footer className="bg-gray-900 py-16 border-t border-gray-800">
      <div className="container mx-auto px-6">
        <motion.div 
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8"
        >
          {/* Project Overview */}
          <div>
            <h3 className={`${fontStyles.heading} mb-4 flex items-center`}>
              <Zap className="mr-2 text-purple-400" /> DePIN Protocol
            </h3>
            <p className={`${fontStyles.body}`}>
              Decentralizing physical infrastructure through blockchain innovation and community-driven networks.
            </p>
          </div>

          {/* Product Links */}
          <div>
            <h3 className={`${fontStyles.heading} mb-4`}>Ecosystem</h3>
            <ul className="space-y-2">
              {[
                { href: "#tokenomics", label: "Tokenomics", icon: Wallet },
                { href: "#governance", label: "Governance", icon: GitMerge },
                { href: "#security", label: "Security", icon: Shield }
              ].map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ translateX: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-center"
                >
                  <link.icon className="mr-2 w-4 h-4 text-purple-400" />
                  <a 
                    href={link.href} 
                    className={`${fontStyles.link}`}
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Developer Resources */}
          <div>
            <h3 className={`${fontStyles.heading} mb-4`}>Developers</h3>
            <ul className="space-y-2">
              {[
                { href: "/docs", label: "Documentation", icon: Globe },
                { href: "/whitepaper", label: "Whitepaper", icon: Zap },
                { href: "/github", label: "GitHub", icon: Github }
              ].map((link) => (
                <motion.li
                  key={link.href}
                  whileHover={{ translateX: 5 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="flex items-center"
                >
                  <link.icon className="mr-2 w-4 h-4 text-purple-400" />
                  <a 
                    href={link.href} 
                    className={`${fontStyles.link}`}
                    target="_blank"
                    rel="noopener noreferrer"
                  >
                    {link.label}
                  </a>
                </motion.li>
              ))}
            </ul>
          </div>

          {/* Community & Social */}
          <div>
            <h3 className={`${fontStyles.heading} mb-4`}>Connect</h3>
            <div className="flex space-x-4 mb-4">
              {[
                { icon: Twitter, href: "https://twitter.com/depinprotocol", label: "Twitter" },
                { icon: Github, href: "https://github.com/depinprotocol", label: "GitHub" },
                { icon: Linkedin, href: "https://linkedin.com/company/depinprotocol", label: "LinkedIn" }
              ].map((social) => (
                <motion.a
                  key={social.label}
                  href={social.href}
                  aria-label={social.label}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileHover={{ scale: 1.2 }}
                  transition={{ type: "spring", stiffness: 300 }}
                  className="text-gray-400 hover:text-purple-300"
                >
                  <social.icon className="w-6 h-6" />
                </motion.a>
              ))}
            </div>
            <p className={`${fontStyles.body} text-sm`}>
              Join our community and help shape the future of decentralized infrastructure.
            </p>
          </div>
        </motion.div>

        {/* Footer Bottom */}
        <div className="mt-12 border-t border-gray-800 pt-8 text-center">
          <p className={`${fontStyles.copyright} mb-2`}>
            &copy; {new Date().getFullYear()} DePIN Protocol. All rights reserved.
          </p>
          <div className="flex justify-center space-x-4">
            {[
              { href: "/privacy", label: "Privacy Policy" },
              { href: "/terms", label: "Terms of Service" }
            ].map((link) => (
              <a 
                key={link.href}
                href={link.href} 
                className={`${fontStyles.link} text-sm`}
              >
                {link.label}
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;