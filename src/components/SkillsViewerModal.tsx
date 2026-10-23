import React, { useState, useMemo } from 'react';
import { X, Sparkles, Terminal, Search, Check, Copy, ExternalLink, BookOpen, Layers } from 'lucide-react';
import { INSTALLED_MYSTEN_SKILLS, InstalledSkill } from '../services/installedSkills';

interface SkillsViewerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const CATEGORIES = ['All', 'DeFi & DeepBook', 'SDKs & APIs', 'Frontend & dApp', 'Move & Contracts', 'Core & Infra'];

export const SkillsViewerModal: React.FC<SkillsViewerModalProps> = ({ isOpen, onClose }) => {
  const [selectedSkillName, setSelectedSkillName] = useState<string>('frontend-apps');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [copied, setCopied] = useState(false);

  const filteredSkills = useMemo(() => {
    return INSTALLED_MYSTEN_SKILLS.filter((s) => {
      const matchesSearch =
        s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        s.desc.toLowerCase().includes(searchTerm.toLowerCase());

      if (!matchesSearch) return false;

      if (activeCategory === 'All') return true;
      if (activeCategory === 'DeFi & DeepBook') {
        return s.name.includes('deepbook') || s.name.includes('ptb');
      }
      if (activeCategory === 'SDKs & APIs') {
        return s.name.includes('sdk') || s.name.includes('client') || s.name.includes('data');
      }
      if (activeCategory === 'Frontend & dApp') {
        return s.name.includes('frontend') || s.name.includes('walrus') || s.name.includes('zklogin');
      }
      if (activeCategory === 'Move & Contracts') {
        return s.name.includes('move') || s.name.includes('kiosk') || s.name.includes('object');
      }
      if (activeCategory === 'Core & Infra') {
        return s.name.includes('gas') || s.name.includes('bridge') || s.name.includes('install') || s.name.includes('build') || s.name.includes('config');
      }
      return true;
    });
  }, [searchTerm, activeCategory]);

  const currentSkill = useMemo(() => {
    return (
      INSTALLED_MYSTEN_SKILLS.find((s) => s.name === selectedSkillName) ||
      INSTALLED_MYSTEN_SKILLS[0]
    );
  }, [selectedSkillName]);

  if (!isOpen) return null;

  const handleCopy = () => {
    if (currentSkill?.content) {
      navigator.clipboard.writeText(currentSkill.content);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-zinc-950 border border-zinc-800 rounded-2xl w-full max-w-5xl h-[88vh] flex flex-col shadow-2xl overflow-hidden">
        {/* Top Header */}
        <div className="p-4 sm:p-5 border-b border-zinc-800 flex items-center justify-between bg-zinc-900/70">
          <div className="flex items-center space-x-3">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-zinc-950 shadow-md shadow-sky-500/20">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h3 className="text-base font-semibold text-white">Mysten Labs Sui Agent Skills</h3>
                <span className="text-[11px] font-mono px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                  {INSTALLED_MYSTEN_SKILLS.length} Skills Installed
                </span>
              </div>
              <p className="text-xs text-zinc-400">
                Installed via <code className="text-sky-300 font-mono">npx skills add mystenlabs/skills --all</code>
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white hover:bg-zinc-800 rounded-lg transition"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search & Category Filter */}
        <div className="px-4 py-3 border-b border-zinc-850 bg-zinc-900/40 flex flex-wrap items-center justify-between gap-3">
          {/* Categories */}
          <div className="flex items-center flex-wrap gap-1.5 text-xs">
            {CATEGORIES.map((cat) => (
              <button
                key={cat}
                onClick={() => setActiveCategory(cat)}
                className={`px-2.5 py-1 rounded-lg transition font-medium ${
                  activeCategory === cat
                    ? 'bg-sky-500/20 border border-sky-500/40 text-sky-300'
                    : 'bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-zinc-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search Bar */}
          <div className="relative w-full sm:w-64">
            <Search className="w-3.5 h-3.5 text-zinc-500 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Filter 31 skills..."
              className="w-full bg-zinc-950 border border-zinc-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500/80 font-mono"
            />
          </div>
        </div>

        {/* Main Body: Master-Detail Layout */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Left: Skill list sidebar */}
          <div className="w-full md:w-72 border-r border-zinc-800/80 bg-zinc-950/70 overflow-y-auto p-2 space-y-1 divide-y divide-zinc-900">
            {filteredSkills.map((skill) => {
              const isSelected = skill.name === selectedSkillName;
              return (
                <button
                  key={skill.name}
                  onClick={() => setSelectedSkillName(skill.name)}
                  className={`w-full text-left p-2.5 rounded-xl transition space-y-1 block ${
                    isSelected
                      ? 'bg-sky-950/40 border border-sky-800/80 text-white'
                      : 'hover:bg-zinc-900/60 text-zinc-300'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <span className="font-mono font-medium text-xs text-sky-400 truncate">
                      {skill.name}
                    </span>
                    {isSelected && <span className="w-1.5 h-1.5 rounded-full bg-sky-400 shrink-0" />}
                  </div>
                  <p className="text-[11px] text-zinc-400 line-clamp-2 leading-relaxed">
                    {skill.desc || 'Sui development skill module'}
                  </p>
                </button>
              );
            })}
          </div>

          {/* Right: Markdown content preview */}
          <div className="flex-1 flex flex-col bg-zinc-950 overflow-hidden">
            {/* Action Bar */}
            <div className="p-3 border-b border-zinc-850 bg-zinc-900/30 flex items-center justify-between text-xs">
              <div className="flex items-center space-x-2">
                <BookOpen className="w-4 h-4 text-sky-400" />
                <span className="font-mono text-zinc-200 font-semibold">
                  .agents/skills/{currentSkill?.name}/SKILL.md
                </span>
              </div>
              <button
                onClick={handleCopy}
                className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-xs text-zinc-300 font-mono transition"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied' : 'Copy SKILL.md'}</span>
              </button>
            </div>

            {/* Content view */}
            <div className="flex-1 overflow-y-auto p-4 sm:p-6 font-mono text-xs text-zinc-300 leading-relaxed whitespace-pre-wrap selection:bg-sky-500/30 selection:text-sky-200">
              {currentSkill?.content || 'No content found.'}
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="p-3.5 border-t border-zinc-800 bg-zinc-900/60 flex items-center justify-between text-xs text-zinc-400">
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Active in SuiPortfolio Agent Engine</span>
          </div>
          <button
            onClick={onClose}
            className="px-4 py-1.5 bg-zinc-800 hover:bg-zinc-700 text-zinc-200 rounded-lg text-xs font-medium transition"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
};
