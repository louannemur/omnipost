'use client';

import styles from '@components/SocialMediaPoster.module.scss';

import * as React from 'react';

import Button from '@components/Button';
import Card from '@components/Card';

interface Platform {
  id: string;
  name: string;
  characterLimit: number;
  url: string;
}

const PLATFORMS: Platform[] = [
  { id: 'twitter', name: 'X / Twitter', characterLimit: 280, url: 'https://twitter.com/intent/tweet?text=' },
  { id: 'linkedin', name: 'LinkedIn', characterLimit: 3000, url: 'https://www.linkedin.com/feed/?shareActive=true&text=' },
  { id: 'threads', name: 'Threads', characterLimit: 500, url: 'https://www.threads.net/intent/post?text=' },
  { id: 'bluesky', name: 'Bluesky', characterLimit: 300, url: 'https://bsky.app/intent/compose?text=' },
];

export default function SocialMediaPoster() {
  const [selectedPlatforms, setSelectedPlatforms] = React.useState<Set<string>>(new Set(['twitter', 'linkedin']));
  const [mode, setMode] = React.useState<'unified' | 'fractured'>('unified');
  const [unifiedContent, setUnifiedContent] = React.useState<string>('');
  const [fracturedContent, setFracturedContent] = React.useState<Record<string, string>>({});
  const [activeTab, setActiveTab] = React.useState<string>('unified');

  // Sync active tab with mode and selection
  React.useEffect(() => {
    if (mode === 'fractured') {
      if (activeTab === 'unified' || !selectedPlatforms.has(activeTab)) {
        const first = Array.from(selectedPlatforms)[0];
        if (first) setActiveTab(first);
      }
    } else {
      setActiveTab('unified');
    }
  }, [selectedPlatforms, mode, activeTab]);

  // Pre-fill fractured content when switching modes
  React.useEffect(() => {
    if (mode === 'fractured') {
      setFracturedContent(prev => {
        const next = { ...prev };
        selectedPlatforms.forEach(id => {
          if (!next[id]) {
            next[id] = unifiedContent;
          }
        });
        return next;
      });
    }
  }, [mode, selectedPlatforms, unifiedContent]);

  const togglePlatform = (id: string) => {
    const newSelected = new Set(selectedPlatforms);
    if (newSelected.has(id)) {
      newSelected.delete(id);
    } else {
      newSelected.add(id);
    }
    setSelectedPlatforms(newSelected);
  };

  const handleContentChange = (val: string) => {
    if (activeTab === 'unified') {
      setUnifiedContent(val);
    } else {
      setFracturedContent(prev => ({ ...prev, [activeTab]: val }));
    }
  };

  const currentText = activeTab === 'unified'
    ? unifiedContent
    : (fracturedContent[activeTab] ?? unifiedContent);

  const getLimits = () => {
    if (activeTab !== 'unified') {
      const p = PLATFORMS.find(platform => platform.id === activeTab);
      return { limit: p?.characterLimit, name: p?.name };
    }

    let minLimit = Infinity;
    let limiterName = '';

    selectedPlatforms.forEach(id => {
      const p = PLATFORMS.find(platform => platform.id === id);
      if (p && p.characterLimit < minLimit) {
        minLimit = p.characterLimit;
        limiterName = p.name;
      }
    });

    return {
      limit: minLimit === Infinity ? undefined : minLimit,
      name: limiterName
    };
  };

  const { limit: currentLimit, name: limitSourceName } = getLimits();
  const charsRemaining = currentLimit ? currentLimit - currentText.length : null;
  const isOverLimit = charsRemaining !== null && charsRemaining < 0;

  const getErrors = () => {
    const errors: string[] = [];
    selectedPlatforms.forEach(id => {
      const platform = PLATFORMS.find(p => p.id === id);
      if (!platform) return;
      const text = mode === 'unified' ? unifiedContent : (fracturedContent[id] ?? unifiedContent);
      if (text.length > platform.characterLimit) {
        errors.push(`${platform.name}: ${text.length - platform.characterLimit} chars over limit`);
      }
    });
    return errors;
  };

  const errors = getErrors();
  const canPost = errors.length === 0 && selectedPlatforms.size > 0;

  const handlePost = () => {
    if (!canPost) return;
    const platformIds = Array.from(selectedPlatforms);
    platformIds.forEach((platformId, index) => {
      const platform = PLATFORMS.find(p => p.id === platformId);
      if (platform) {
        const text = mode === 'unified' ? unifiedContent : (fracturedContent[platformId] ?? unifiedContent);
        if (text.trim()) {
          // Stagger window.open calls to avoid pop-up blocker
          setTimeout(() => {
            window.open(platform.url + encodeURIComponent(text), '_blank');
          }, index * 500);
        }
      }
    });
  };

  const handleCopyText = () => {
    navigator.clipboard.writeText(currentText);
  };

  const handleRestart = () => {
    setUnifiedContent('');
    setFracturedContent({});
    setMode('unified');
    setActiveTab('unified');
  };

  return (
    <div className={styles.root}>
      {/* Navigation */}
      <nav className={styles.nav}>
        <div className={styles.logoContainer}>
          <img src="/logo.svg" alt="OmniPost logo" className={styles.logoIcon} />
          <div className={styles.logo}>OmniPost</div>
        </div>
        <Button theme="SECONDARY" onClick={handleRestart}>
          Restart
        </Button>
      </nav>

      <main className={styles.main}>
        {/* Platform Selection Card */}
        <section className={styles.section}>
          <div className={styles.sectionLabel}>Platforms</div>
          <Card title="PLATFORMS">
            <div className={styles.platformGroup}>
              {PLATFORMS.map((platform) => {
                const isActive = selectedPlatforms.has(platform.id);
                return (
                  <Button
                    key={platform.id}
                    theme={isActive ? 'PRIMARY' : 'SECONDARY'}
                    onClick={() => togglePlatform(platform.id)}
                  >
                    {platform.name}
                  </Button>
                );
              })}
            </div>
          </Card>
        </section>

        {/* Composition Card */}
        <section className={styles.section}>
          <div className={styles.sectionHeader}>
            <div className={styles.sectionLabel}>
              {mode === 'unified' ? 'Same Post' : 'Custom Per Platform'}
            </div>
            <div className={styles.modeToggle}>
              <Button
                theme={mode === 'unified' ? 'PRIMARY' : 'SECONDARY'}
                onClick={() => setMode('unified')}
              >
                Same
              </Button>
              <Button
                theme={mode === 'fractured' ? 'PRIMARY' : 'SECONDARY'}
                onClick={() => setMode('fractured')}
              >
                Custom
              </Button>
            </div>
          </div>
          <Card title="COMPOSE">
            {/* Tabs for Fractured Mode */}
            {mode === 'fractured' && selectedPlatforms.size > 0 && (
              <div className={styles.tabBar}>
                {Array.from(selectedPlatforms).map(id => {
                  const p = PLATFORMS.find(pl => pl.id === id);
                  if (!p) return null;
                  const hasError = (fracturedContent[id] ?? unifiedContent).length > p.characterLimit;
                  const isCurrentTab = activeTab === id;
                  return (
                    <Button
                      key={id}
                      theme={isCurrentTab ? 'PRIMARY' : 'SECONDARY'}
                      onClick={() => setActiveTab(id)}
                    >
                      <span className={hasError ? styles.tabError : ''}>{p.name}</span>
                      {hasError && <span className={styles.tabErrorIcon}> (!)</span>}
                    </Button>
                  );
                })}
              </div>
            )}

            {/* Editor */}
            <div className={styles.editorArea}>
              <textarea
                className={styles.textarea}
                value={currentText}
                onChange={(e) => handleContentChange(e.target.value)}
                placeholder={mode === 'unified'
                  ? "Write your post..."
                  : `Write your ${PLATFORMS.find(p => p.id === activeTab)?.name} post...`}
              />

              {/* Footer inside card */}
              <div className={styles.editorFooter}>
                <div className={isOverLimit ? styles.charCountError : styles.charCount}>
                  {charsRemaining !== null ? (
                    <span>
                      {charsRemaining} left / {currentLimit}
                      {limitSourceName && mode === 'unified' && ` (${limitSourceName})`}
                    </span>
                  ) : (
                    <span>∞</span>
                  )}
                </div>
                <div className={styles.editorActions}>
                  <Button theme="SECONDARY" onClick={handleCopyText}>
                    Copy
                  </Button>
                  <Button onClick={handlePost} isDisabled={!canPost}>
                    Post
                  </Button>
                </div>
              </div>
            </div>
          </Card>
          <div className={styles.disclaimer}>
            You must be logged in to each platform for posting to work.
          </div>
        </section>

        {/* Errors */}
        {errors.length > 0 && (
          <div className={styles.errorBanner}>
            {errors.map((err, i) => (
              <div key={i} className={styles.errorText}>[ERROR] {err}</div>
            ))}
          </div>
        )}
      </main>

      <footer className={styles.footer}>
        <div>OmniPost by <a href="https://x.com/louannemmurphy" target="_blank" rel="noopener noreferrer">Louanne Murphy</a></div>
        <div>
          Components by <a href="https://www.sacred.computer" target="_blank" rel="noopener noreferrer">Sacred Computer</a>
        </div>
      </footer>
    </div>
  );
}
