'use client';

import { motion, AnimatePresence } from 'framer-motion';
import Image from 'next/image';
import Link from 'next/link';
import { useCallback, useEffect, useState } from 'react';
import Particles from 'react-tsparticles';
import type { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';

const LoadingSpinner = () => (
  <motion.div
    initial={{ opacity: 1 }}
    exit={{ opacity: 0 }}
    className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/80 backdrop-blur-sm"
  >
    <div className="relative w-20 h-20">
      <motion.div
        className="w-full h-full border-4 border-gray-300 rounded-full"
        style={{ borderTopColor: 'transparent' }}
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
      <motion.div
        className="absolute inset-0 border-4 border-blue-500 rounded-full"
        style={{ borderTopColor: 'transparent', opacity: 0.3 }}
        animate={{ rotate: -360 }}
        transition={{ duration: 1.5, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  </motion.div>
);

export default function Home() {
  const [loading, setLoading] = useState<boolean>(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 500);

    return () => clearTimeout(timer);
  }, []);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-200 via-gray-500 to-gray-700">
      <AnimatePresence>{loading && <LoadingSpinner />}</AnimatePresence>

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
              direction: 'outside',
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
              value: 100,
            },
            opacity: {
              value: 0.3,
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

      <div className="relative z-10">
        <motion.section
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1 }}
          className="min-h-screen flex flex-col items-center justify-center text-center px-4 relative overflow-hidden"
        >
          <motion.h1
            initial={{ y: -20, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="text-4xl md:text-6xl font-bold text-white mb-6"
          >
            Добро пожаловать в мир кино!!!
          </motion.h1>

          <motion.p
            initial={{ y: -20, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.7, duration: 0.8 }}
            className="text-xl md:text-2xl text-gray-200 mb-8 max-w-2xl"
          >
            Откройте для себя новые фильмы, делитесь впечатлениями и находите
            единомышленников
          </motion.p>

          <motion.div
            initial={{ y: 50, opacity: 0, scale: 0.5 }}
            animate={{ y: 0, opacity: 1, scale: 1 }}
            transition={{ delay: 0.9, duration: 0.8 }}
          >
            <Link
              href="/catalog"
              className="bg-gradient-to-r from-purple-600 to-blue-600 text-white px-8 py-4 rounded-full text-lg font-medium hover:opacity-90 transition-opacity"
            >
              Перейти к каталогу
            </Link>
          </motion.div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="py-20 px-4 bg-white/10 backdrop-blur-sm"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
              Что вы можете делать?
            </h2>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                {
                  title: 'Каталог фильмов',
                  description:
                    'Огромная коллекция фильмов разных жанров и годов',
                  icon: '🎬',
                },
                {
                  title: 'Умный поиск',
                  description:
                    'Находите фильмы по жанрам, годам, рейтингу и многим другим параметрам',
                  icon: '🔍',
                },
                {
                  title: 'Рецензии',
                  description:
                    'Делитесь своими впечатлениями и читайте мнения других пользователей',
                  icon: '✍️',
                },
              ].map((feature, index) => (
                <motion.div
                  key={index}
                  initial={{ y: 20, opacity: 0 }}
                  whileInView={{ y: 0, opacity: 1 }}
                  transition={{ delay: index * 0.2, duration: 0.8 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <div className="text-4xl mb-4">{feature.icon}</div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {feature.title}
                  </h3>
                  <p className="text-gray-200">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>

        <motion.section
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          transition={{ duration: 1 }}
          viewport={{ once: true }}
          className="py-20 px-4"
        >
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-white">
              На чем сделан сайт?
            </h2>
            <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                {
                  title: 'Next.js',
                  description: 'Современный React фреймворк',
                  icon: '/next.svg',
                },
                {
                  title: 'Tailwind CSS',
                  description: 'Utility-first CSS фреймворк',
                  icon: '/tailwind.svg',
                },
                {
                  title: 'Framer Motion',
                  description: 'Библиотека анимаций',
                  icon: '/framer.svg',
                },
                {
                  title: 'Ant Design',
                  description: 'UI компоненты',
                  icon: '/antd.svg',
                },
                {
                  title: 'Tsparticles',
                  description: 'Библиотека анимаций',
                  icon: '/tsparticles.svg',
                },
                {
                  title: 'Debounce',
                  description: 'Библиотека для оптимизации',
                  icon: '/debounce.svg',
                },
                {
                  title: 'Jotai',
                  description: 'Библиотека для работы с состоянием',
                  icon: '/jotai.svg',
                },
                {
                  title: 'Спасибо за хорошее обучение, мои успешные проекты:',
                  description: (
                    <div className="flex flex-col gap-2">
                      <a
                        href="https://app.takeabot.co.za/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 underline transition-colors"
                      >
                        Take a Bot
                      </a>
                      <a
                        href="https://www.aivatar.co.za/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 underline transition-colors"
                      >
                        Ai Avatar
                      </a>
                      <a
                        href="https://doska.boxtrucs.doska.work/"
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-300 hover:text-blue-200 underline transition-colors"
                      >
                        Продажа фургонов
                      </a>
                    </div>
                  ),
                  icon: '/smiley.svg',
                },
              ].map((tech, index) => (
                <motion.div
                  key={index}
                  initial={{ scale: 0.9, opacity: 0 }}
                  whileInView={{ scale: 1, opacity: 1 }}
                  whileHover={{ y: -5 }}
                  transition={{ delay: index * 0.1, duration: 0.4 }}
                  viewport={{ once: true }}
                  className="bg-white/10 backdrop-blur-md p-6 rounded-xl shadow-sm hover:shadow-md transition-all text-center"
                >
                  <div className="h-20 flex items-center justify-center mb-4">
                    <Image
                      src={tech.icon}
                      alt={tech.title}
                      width={60}
                      height={60}
                      className="object-contain invert"
                    />
                  </div>
                  <h3 className="text-xl font-semibold mb-2 text-white">
                    {tech.title}
                  </h3>
                  <div className="text-gray-200">{tech.description}</div>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.section>
      </div>
    </div>
  );
}
