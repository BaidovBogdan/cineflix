'use client';

import { useCallback, useState, useEffect, useRef } from 'react';
import { useAtom } from 'jotai';
import { commentsAtom } from '@/app/atom/atom';
import {
  Button,
  ConfigProvider,
  Rate,
  Input,
  Card,
  Avatar,
  Tooltip,
} from 'antd';
import { motion } from 'framer-motion';
import Particles from 'react-tsparticles';
import { loadSlim } from 'tsparticles-slim';
import type { Engine } from 'tsparticles-engine';
import Link from 'next/link';
import Image from 'next/image';
import {
  ArrowLeftOutlined,
  SendOutlined,
  UserOutlined,
} from '@ant-design/icons';
import { theme } from 'antd';
import { debounce } from 'lodash';
import { Review } from '@/app/types/type';

const { TextArea } = Input;

const MOVIE = {
  id: 1,
  title: 'Inception',
  year: 2010,
  rating: 4.8,
  genre: 'Фантастика',
  director: 'Кристофер Нолан',
  description: `"Inception" - это захватывающий научно-фантастический триллер, который погружает зрителя в мир осознанных сновидений. Фильм рассказывает историю Доминика Кобба, искусного вора, который специализируется на извлечении ценной информации из подсознания людей во время сна. Ему предлагают шанс вернуться к нормальной жизни, но для этого нужно выполнить невозможное задание - внедрить идею в чужое сознание. Вместе с командой профессионалов он погружается в многоуровневый мир снов, где реальность и иллюзия переплетаются, создавая захватывающий лабиринт возможностей и опасностей.`,
  image: 'https://picsum.photos/800/500?random=1',
  cast: [
    'Леонардо ДиКаприо',
    'Эллен Пейдж',
    'Том Харди',
    'Джозеф Гордон-Левитт',
  ],
  reviews: [
    {
      id: 1,
      author: 'Алексей',
      rating: 5,
      text: 'Потрясающий фильм, который заставляет задуматься о природе реальности. Визуальные эффекты и сюжет просто великолепны!',
      avatar: 'https://picsum.photos/50/50?random=1',
      date: new Date().toLocaleDateString(),
    },
    {
      id: 2,
      author: 'Мария',
      rating: 4,
      text: 'Сложный для понимания, но очень интересный фильм. Пересматривала несколько раз, каждый раз открывая что-то новое.',
      avatar: 'https://picsum.photos/50/50?random=2',
      date: new Date().toLocaleDateString(),
    },
  ] as Review[],
};

export default function MovieDetails() {
  const sentSoundRef = useRef<HTMLAudioElement | null>(null);
  const [, setReview] = useState('');
  const [localReview, setLocalReview] = useState('');
  const [userRating, setUserRating] = useState(0);
  const [comments, setComments] = useAtom(commentsAtom);
  const [allReviews, setAllReviews] = useState<Review[]>(MOVIE.reviews);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  useEffect(() => {
    sentSoundRef.current = new Audio('/sentmessage.mp3');
    const savedReviews = comments
      .map(comment => {
        try {
          return JSON.parse(comment) as Review;
        } catch (e) {
          console.error('Error parsing comment:', e);
          return null;
        }
      })
      .filter((review): review is Review => review !== null);

    setAllReviews([...MOVIE.reviews, ...savedReviews]);
    setHasUserReviewed(
      savedReviews.some(review => review.author === 'Пользователь')
    );
  }, [comments]);

  const debouncedSetReview = useCallback(
    debounce((value: string) => {
      setReview(value);
    }, 300),
    []
  );

  const handleReviewChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const value = e.target.value;
    setLocalReview(value);
    debouncedSetReview(value);
  };

  const handleSubmitReview = () => {
    if (!localReview.trim() || !userRating || hasUserReviewed) return;

    const newReview: Review = {
      id: Date.now(),
      author: 'Пользователь',
      rating: userRating,
      text: localReview,
      avatar: 'https://picsum.photos/50/50?random=' + Math.random(),
      date: new Date().toLocaleDateString(),
    };

    setAllReviews(prev => [newReview, ...prev]);
    setComments(prev => [JSON.stringify(newReview), ...prev]);
    setReview('');
    setLocalReview('');
    setUserRating(0);
    setHasUserReviewed(true);
    playMessageSound();
  };

  const getTooltipText = () => {
    if (hasUserReviewed) {
      return 'Вы уже оставили отзыв';
    } else if (!localReview.trim() && !userRating) {
      return 'Введите комментарий и поставьте оценку';
    } else if (!localReview.trim()) {
      return 'Введите комментарий';
    } else if (!userRating) {
      return 'Поставьте оценку';
    } else {
      return '';
    }
  };

  const playMessageSound = () => {
    if (sentSoundRef.current) {
      sentSoundRef.current.currentTime = 0;
      sentSoundRef.current.play().catch(error => {
        console.error('Error playing message sound:', error);
      });
    }
  };

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const textAnimation = {
    hidden: { opacity: 0, y: 20 },
    visible: (i: number) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: 'easeOut',
      },
    }),
  };

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
      <div className="min-h-screen bg-[#0f172a]">
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

        <div className="relative z-10 min-h-screen p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
          >
            <Link href="/catalog">
              <Button
                icon={<ArrowLeftOutlined />}
                size="large"
                className="mb-6 !bg-white/10 backdrop-blur-md border-white/20"
              >
                Назад
              </Button>
            </Link>
          </motion.div>

          <div className="max-w-7xl mx-auto">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                className="relative aspect-video rounded-2xl overflow-hidden bg-white/10 backdrop-blur-md border border-white/20"
              >
                <Image
                  src={MOVIE.image}
                  alt={MOVIE.title}
                  fill
                  priority
                  className="object-cover"
                />
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
              >
                <motion.h1
                  className="text-3xl md:text-4xl font-bold text-white mb-4"
                  variants={textAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={0}
                >
                  {MOVIE.title}
                </motion.h1>

                <motion.div
                  variants={textAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={1}
                  className="flex items-center gap-4 mb-4"
                >
                  <Rate disabled defaultValue={MOVIE.rating} allowHalf />
                  <span className="text-gray-300">{MOVIE.rating}/5</span>
                </motion.div>

                <motion.div
                  variants={textAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={2}
                  className="space-y-2 mb-4"
                >
                  <p className="text-gray-300">
                    <span className="text-white font-medium">Год:</span>{' '}
                    {MOVIE.year}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-white font-medium">Жанр:</span>{' '}
                    {MOVIE.genre}
                  </p>
                  <p className="text-gray-300">
                    <span className="text-white font-medium">Режиссер:</span>{' '}
                    {MOVIE.director}
                  </p>
                </motion.div>

                <motion.p
                  variants={textAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={3}
                  className="text-gray-300 mb-4 leading-relaxed"
                >
                  {MOVIE.description}
                </motion.p>

                <motion.div
                  variants={textAnimation}
                  initial="hidden"
                  animate="visible"
                  custom={4}
                >
                  <h3 className="text-white font-medium mb-2">В ролях:</h3>
                  <div className="flex flex-wrap gap-2">
                    {MOVIE.cast.map((actor, index) => (
                      <span
                        key={actor}
                        className="px-3 py-1 bg-white/5 rounded-full text-gray-300 text-sm"
                      >
                        {actor}
                      </span>
                    ))}
                  </div>
                </motion.div>
              </motion.div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="mt-8"
            >
              <h2 className="text-2xl font-bold text-white mb-6">Отзывы</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                {allReviews.map((review, index) => (
                  <motion.div
                    key={review.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: 0.5 + index * 0.1 }}
                  >
                    <Card className="bg-white/10 backdrop-blur-md border-white/20">
                      <div className="flex items-start gap-4">
                        <Avatar
                          src={review.avatar}
                          size={40}
                          icon={<UserOutlined />}
                        />
                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-2">
                            <div>
                              <span className="font-medium text-white">
                                {review.author}
                              </span>
                              <span className="text-gray-400 text-sm ml-2">
                                {review.date}
                              </span>
                            </div>
                            <Rate disabled defaultValue={review.rating} />
                          </div>
                          <p className="text-gray-300">{review.text}</p>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.6 }}
                className="bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl p-6"
              >
                <h3 className="text-xl font-bold text-white mb-4">
                  Оставить отзыв
                </h3>
                <div className="mb-4">
                  <Rate
                    value={userRating}
                    onChange={setUserRating}
                    disabled={hasUserReviewed}
                  />
                </div>
                <TextArea
                  value={localReview}
                  onChange={handleReviewChange}
                  placeholder="Поделитесь своими впечатлениями о фильме..."
                  className="mb-4 !bg-white/5 !border-white/20"
                  rows={4}
                  disabled={hasUserReviewed}
                />
                <Tooltip title={getTooltipText()}>
                  <Button
                    type="primary"
                    icon={<SendOutlined />}
                    onClick={handleSubmitReview}
                    disabled={
                      !localReview.trim() || !userRating || hasUserReviewed
                    }
                    className="!bg-blue-500 hover:!bg-blue-600 mt-20"
                  >
                    Отправить отзыв
                  </Button>
                </Tooltip>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </div>
    </ConfigProvider>
  );
}
