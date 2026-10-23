import React, { useState } from 'react';
import {
  Sparkles,
  ShieldAlert,
  TrendingUp,
  Scale,
  Send,
  Bot,
  User,
  ArrowRight,
  CheckCircle2,
  AlertTriangle,
  Lightbulb,
  Terminal,
} from 'lucide-react';
import { PortfolioSummary, AgentMessage, AgentRecommendation, AgentSkillDefinition } from '../types/portfolio';
import { SUI_AGENT_SKILLS, askSuiAgent } from '../skills/agentEngine';

interface AgentAssistantProps {
  portfolio: PortfolioSummary;
}

export const AgentAssistant: React.FC<AgentAssistantProps> = ({ portfolio }) => {
  const [messages, setMessages] = useState<AgentMessage[]>([
    {
      id: 'welcome',
      sender: 'agent',
      text: `Hello! I am your Sui DeFi Agent powered by Mysten Labs Agent Skills. I can audit your portfolio risk, find high-yield opportunities across Navi & Cetus, monitor lending health factors, and generate rebalance PTBs. How can I help you today?`,
      timestamp: Date.now(),
    },
  ]);
  const [inputVal, setInputVal] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const handleRunSkill = async (skill: AgentSkillDefinition) => {
    setIsProcessing(true);

    // Add user intent message
    const userMsg: AgentMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: `Run Skill: ${skill.title}`,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const result = await skill.execute(portfolio);
      const agentMsg: AgentMessage = {
        id: `msg-${Date.now()}-a`,
        sender: 'agent',
        text: result.summary,
        timestamp: Date.now(),
        skillUsed: skill.name,
        result,
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!inputVal.trim() || isProcessing) return;

    const userQuery = inputVal.trim();
    setInputVal('');
    setIsProcessing(true);

    const userMsg: AgentMessage = {
      id: `msg-${Date.now()}-u`,
      sender: 'user',
      text: userQuery,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, userMsg]);

    try {
      const result = await askSuiAgent(userQuery, portfolio);
      const agentMsg: AgentMessage = {
        id: `msg-${Date.now()}-a`,
        sender: 'agent',
        text: result.summary,
        timestamp: Date.now(),
        skillUsed: 'sui-agent-skills',
        result,
      };
      setMessages((prev) => [...prev, agentMsg]);
    } catch (err) {
      console.error(err);
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="bg-zinc-900/60 border border-zinc-800/80 rounded-2xl overflow-hidden backdrop-blur-sm flex flex-col h-[650px] shadow-2xl">
      {/* Top Header */}
      <div className="p-4 sm:p-5 border-b border-zinc-800/80 bg-zinc-950/60 flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-sky-500 to-cyan-400 flex items-center justify-center text-zinc-950 shadow-md shadow-sky-500/20">
            <Sparkles className="w-4 h-4" />
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-sm font-semibold text-white">Sui DeFi Agent</h3>
              <span className="text-[10px] font-mono bg-sky-950/70 border border-sky-800/80 text-sky-400 px-1.5 py-0.5 rounded">
                Sui Skills Engine
              </span>
            </div>
            <p className="text-[11px] text-zinc-400">
              Autonomous on-chain analysis & yield optimization
            </p>
          </div>
        </div>

        {/* Status */}
        <div className="flex items-center space-x-1.5 text-xs text-zinc-400">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="font-mono text-[11px]">Ready</span>
        </div>
      </div>

      {/* Quick Skill Triggers Bar */}
      <div className="p-3 bg-zinc-950/40 border-b border-zinc-800/60 flex flex-wrap items-center gap-2">
        <span className="text-[11px] text-zinc-500 font-medium ml-1">Run Skill:</span>
        {SUI_AGENT_SKILLS.map((skill) => {
          const Icon =
            skill.iconName === 'ShieldAlert'
              ? ShieldAlert
              : skill.iconName === 'TrendingUp'
              ? TrendingUp
              : Scale;

          return (
            <button
              key={skill.name}
              onClick={() => handleRunSkill(skill)}
              disabled={isProcessing}
              className="flex items-center space-x-1.5 px-3 py-1.5 rounded-lg bg-zinc-900 border border-zinc-800 hover:border-sky-500/50 hover:bg-zinc-850 text-xs text-zinc-300 hover:text-white transition active:scale-95 disabled:opacity-50"
            >
              <Icon className="w-3.5 h-3.5 text-sky-400" />
              <span>{skill.title}</span>
            </button>
          );
        })}
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-4 sm:p-5 space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex items-start space-x-3 ${
              msg.sender === 'user' ? 'flex-row-reverse space-x-reverse' : ''
            }`}
          >
            {/* Avatar */}
            <div
              className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 text-xs ${
                msg.sender === 'user'
                  ? 'bg-zinc-800 border border-zinc-700 text-zinc-300'
                  : 'bg-sky-500/20 border border-sky-500/40 text-sky-400'
              }`}
            >
              {msg.sender === 'user' ? <User className="w-3.5 h-3.5" /> : <Bot className="w-3.5 h-3.5" />}
            </div>

            {/* Bubble */}
            <div
              className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-4 text-xs leading-relaxed space-y-3 ${
                msg.sender === 'user'
                  ? 'bg-sky-600 text-zinc-950 font-medium'
                  : 'bg-zinc-950/80 border border-zinc-850 text-zinc-200'
              }`}
            >
              {/* Skill badge if used */}
              {msg.skillUsed && (
                <div className="flex items-center space-x-1 text-[10px] text-sky-400 font-mono uppercase tracking-wider pb-1 border-b border-zinc-850">
                  <Terminal className="w-3 h-3" />
                  <span>Executed Skill: {msg.skillUsed}</span>
                </div>
              )}

              {/* Text */}
              <p className="whitespace-pre-line text-sm">{msg.text}</p>

              {/* Metrics Grid if available */}
              {msg.result?.metrics && (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 border-t border-zinc-850">
                  {Object.entries(msg.result.metrics).map(([key, val]) => (
                    <div key={key} className="bg-zinc-900 border border-zinc-800 rounded-lg p-2">
                      <span className="text-[10px] text-zinc-400 block truncate">{key}</span>
                      <span className="text-xs font-bold text-white mono-num">{val}</span>
                    </div>
                  ))}
                </div>
              )}

              {/* Recommendations list */}
              {msg.result?.recommendations && msg.result.recommendations.length > 0 && (
                <div className="space-y-2 pt-2">
                  <span className="text-[11px] font-semibold text-zinc-300 block uppercase tracking-wider">
                    Agent Action Items:
                  </span>
                  {msg.result.recommendations.map((rec) => {
                    const isWarn = rec.severity === 'warning';
                    const isOpp = rec.severity === 'opportunity';

                    return (
                      <div
                        key={rec.id}
                        className={`rounded-xl p-3 border space-y-1.5 ${
                          isWarn
                            ? 'bg-amber-950/20 border-amber-800/40'
                            : isOpp
                            ? 'bg-emerald-950/20 border-emerald-800/40'
                            : 'bg-zinc-900 border-zinc-800'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div className="flex items-center space-x-1.5 font-semibold text-xs">
                            {isWarn ? (
                              <AlertTriangle className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                            ) : isOpp ? (
                              <Sparkles className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                            ) : (
                              <Lightbulb className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                            )}
                            <span className={isWarn ? 'text-amber-300' : isOpp ? 'text-emerald-300' : 'text-zinc-200'}>
                              {rec.title}
                            </span>
                          </div>
                          {rec.protocol && (
                            <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-zinc-900 text-zinc-400 border border-zinc-800">
                              {rec.protocol}
                            </span>
                          )}
                        </div>

                        <p className="text-[11px] text-zinc-300 leading-normal">
                          {rec.description}
                        </p>

                        {rec.estimatedImpact && (
                          <div className="text-[10px] text-zinc-400 font-mono pt-0.5">
                            Impact: <span className="text-sky-300">{rec.estimatedImpact}</span>
                          </div>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </div>
        ))}

        {isProcessing && (
          <div className="flex items-center space-x-2 text-xs text-sky-400 animate-pulse pl-10">
            <Sparkles className="w-4 h-4" />
            <span>Agent executing Sui dev skill & calculating on-chain metrics...</span>
          </div>
        )}
      </div>

      {/* Input bar */}
      <form
        onSubmit={handleSendMessage}
        className="p-3 sm:p-4 bg-zinc-950/80 border-t border-zinc-800/80 flex items-center gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Ask Sui Agent (e.g., 'Where can I get the best APY?', 'Audit my portfolio risk')..."
          className="flex-1 bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-2.5 text-xs sm:text-sm text-zinc-100 placeholder:text-zinc-500 focus:outline-none focus:border-sky-500/80 focus:ring-1 focus:ring-sky-500/50"
        />
        <button
          type="submit"
          disabled={!inputVal.trim() || isProcessing}
          className="p-2.5 bg-sky-500 hover:bg-sky-400 text-zinc-950 font-bold rounded-xl transition active:scale-95 disabled:opacity-50 shrink-0"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};

