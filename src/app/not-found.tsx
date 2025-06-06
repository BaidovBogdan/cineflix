'use client';

import { useCallback } from 'react';
import { Button, ConfigProvider, theme } from 'antd';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';
import Link from 'next/link';

export default function NotFound() {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <ConfigProvider
      theme={{
        algorithm: theme.darkAlgorithm,
        token: {
          colorBgContainer: 'rgba(255, 255, 255, 0.1)',
          colorBgElevated: 'rgba(255, 255, 255, 0.1)',
          colorBorder: 'rgba(255, 255, 255, 0.2)',
          borderRadius: 12,
        },
      }}
    >
      <div className="min-h-screen bg-[#0f172a] relative">
        <Particles
          id="tsparticles"
          init={particlesInit}
          className="!fixed inset-0"
          options={{
            fullScreen: {
              enable: true,
              zIndex: 1,
            },
            background: {
              color: {
                value: 'transparent',
              },
            },
            fpsLimit: 120,
            interactivity: {
              events: {
                onClick: {
                  enable: true,
                  mode: 'push',
                },
                onHover: {
                  enable: true,
                  mode: 'repulse',
                },
                resize: true,
              },
              modes: {
                push: {
                  quantity: 4,
                },
                repulse: {
                  distance: 100,
                  duration: 0.4,
                },
              },
            },
            particles: {
              color: {
                value: '#ffffff',
              },
              links: {
                color: '#ffffff',
                distance: 150,
                enable: true,
                opacity: 0.5,
                width: 1,
              },
              move: {
                direction: 'none',
                enable: true,
                outModes: {
                  default: 'bounce',
                },
                random: false,
                speed: 2,
                straight: false,
              },
              number: {
                density: {
                  enable: true,
                  area: 800,
                },
                value: 20,
              },
              opacity: {
                value: 0.5,
              },
              shape: {
                type: 'circle',
              },
              size: {
                value: { min: 1, max: 5 },
              },
            },
            detectRetina: true,
          }}
        />

        <div className="relative z-10 min-h-screen flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, scale: 0 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{
              duration: 0.7,
              ease: [0.34, 1.56, 0.64, 1],
            }}
            className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-8 md:p-12 max-w-2xl w-full text-center"
          >
            <motion.h1
              initial={{ opacity: 0, scale: 0 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{
                duration: 0.5,
                delay: 0.6,
                ease: [0.34, 1.56, 0.64, 1],
              }}
              className="text-6xl md:text-8xl font-bold text-white mb-4"
            >
              404
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 0.8,
                ease: 'easeOut',
              }}
              className="text-xl md:text-2xl text-gray-300 mb-8"
            >
              Упс! Страница, которую вы ищете, не существует.
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{
                duration: 0.5,
                delay: 1,
                ease: 'easeOut',
              }}
            >
              <Link href="/">
                <Button
                  type="primary"
                  size="large"
                  className="!bg-blue-500 hover:!bg-blue-600 transition-colors duration-300"
                >
                  Вернуться на главную
                </Button>
              </Link>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </ConfigProvider>
  );
}
