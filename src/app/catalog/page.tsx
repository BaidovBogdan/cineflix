'use client';

import { useState, useCallback, useEffect, useMemo } from 'react';
import {
  Layout,
  Card,
  Rate,
  Select,
  Slider,
  Button,
  Pagination,
  Input,
  Tag,
  ConfigProvider,
  theme,
} from 'antd';
import { useRouter } from 'next/navigation';
import { SearchOutlined, FilterOutlined } from '@ant-design/icons';
import Particles from 'react-tsparticles';
import type { Engine } from 'tsparticles-engine';
import { loadSlim } from 'tsparticles-slim';
import { motion } from 'framer-motion';
import { debounce } from 'lodash';
import Image from 'next/image';

const { Sider, Content } = Layout;

const MOVIES = Array.from({ length: 20 }, (_, i) => ({
  id: i + 1,
  title: `Фильм ${i + 1}`,
  year: 2020 + Math.floor(Math.random() * 4),
  rating: (3 + Math.random() * 2).toFixed(1),
  genre: ['Боевик', 'Драма', 'Комедия', 'Триллер'][
    Math.floor(Math.random() * 4)
  ],
  image: `https://picsum.photos/300/450?random=${i}`,
}));

const GENRES = [
  'Боевик',
  'Драма',
  'Комедия',
  'Триллер',
  'Ужасы',
  'Фантастика',
] as const;
type Genre = (typeof GENRES)[number];

export default function Catalog() {
  const router = useRouter();
  const [, setCollapsed] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [selectedGenres, setSelectedGenres] = useState<Genre[]>([]);
  const [yearRange, setYearRange] = useState<[number, number]>([1990, 2024]);
  const [ratingRange, setRatingRange] = useState<[number, number]>([0, 5]);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [isLoading, setIsLoading] = useState<boolean>(false);

  const particlesInit = useCallback(async (engine: Engine) => {
    await loadSlim(engine);
  }, []);

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setIsLoading(false);
    }, 500),
    []
  );

  const handleSearch = (e: React.ChangeEvent<HTMLInputElement>) => {
    setIsLoading(true);
    debouncedSearch(e.target.value);
  };

  useEffect(() => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }, [setCurrentPage, currentPage]);

  useEffect(() => {
    setCurrentPage(1);
  }, [selectedGenres, yearRange, ratingRange, searchQuery]);

  const debouncedFilter = useCallback(
    debounce(() => {
      setIsLoading(false);
    }, 500),
    []
  );

  const filteredMovies = useMemo(() => {
    setIsLoading(true);
    const filtered = MOVIES.filter(movie => {
      const matchesSearch = movie.title
        .toLowerCase()
        .includes(searchQuery.toLowerCase());
      const matchesGenre =
        selectedGenres.length === 0 ||
        selectedGenres.includes(movie.genre as Genre);
      const matchesYear =
        movie.year >= yearRange[0] && movie.year <= yearRange[1];
      const matchesRating =
        parseFloat(movie.rating) >= ratingRange[0] &&
        parseFloat(movie.rating) <= ratingRange[1];
      return matchesSearch && matchesGenre && matchesYear && matchesRating;
    });
    debouncedFilter();
    return filtered;
  }, [searchQuery, selectedGenres, yearRange, ratingRange, debouncedFilter]);

  const pageSize = 10;
  const currentMovies = filteredMovies.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

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
                value: 70,
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

        <Layout className="min-h-screen !bg-transparent relative z-10">
          <Sider
            breakpoint="lg"
            collapsedWidth="0"
            onBreakpoint={broken => setCollapsed(broken)}
            width={300}
            theme="dark"
            className="bg-gray-900/20 backdrop-blur-md border-r border-white/20 z-50 3xl:!fixed 3xl:h-full md:!bg-white/10"
          >
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col gap-6 p-4"
            >
              <div>
                <h3 className="text-white mb-2 font-medium">Поиск</h3>
                <Input
                  placeholder="Название фильма"
                  prefix={<SearchOutlined className="text-gray-400" />}
                  onChange={handleSearch}
                  className="!bg-white/10 !border-white/20"
                />
              </div>

              <div>
                <h3 className="text-white mb-2 font-medium">Жанры</h3>
                <Select
                  mode="multiple"
                  style={{ width: '100%' }}
                  placeholder="Выберите жанры"
                  value={selectedGenres}
                  onChange={setSelectedGenres}
                  options={GENRES.map(genre => ({
                    label: genre,
                    value: genre,
                  }))}
                  className="!bg-white/10"
                  dropdownClassName="!bg-white/10 !border-white/20 backdrop-blur-md"
                />
              </div>

              <div>
                <h3 className="text-white mb-2 font-medium">Год выпуска</h3>
                <Slider
                  range
                  min={1990}
                  max={2024}
                  value={yearRange}
                  //@ts-ignore
                  onChange={setYearRange}
                  className="mt-2"
                />
                <div className="text-gray-300 text-sm mt-1">
                  {yearRange[0]} - {yearRange[1]}
                </div>
              </div>

              <div>
                <h3 className="text-white mb-2 font-medium">Рейтинг</h3>
                <Slider
                  range
                  min={0}
                  max={5}
                  step={0.5}
                  value={ratingRange}
                  //@ts-ignore
                  onChange={setRatingRange}
                  className="mt-2"
                />
                <div className="text-gray-300 text-sm mt-1">
                  {ratingRange[0]} - {ratingRange[1]}
                </div>
              </div>

              <Button
                type="primary"
                icon={<FilterOutlined />}
                onClick={() => {
                  setSelectedGenres([]);
                  setYearRange([1990, 2024]);
                  setRatingRange([0, 5]);
                  setSearchQuery('');
                }}
                className="mt-4 !bg-blue-500 hover:!bg-blue-600"
              >
                Сбросить фильтры
              </Button>
            </motion.div>
          </Sider>

          <Content className="p-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="max-w-7xl mx-auto"
            >
              <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl font-bold text-white">
                  Каталог фильмов
                </h1>
                <span className="text-gray-300">
                  Найдено: {filteredMovies.length}
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 mb-8">
                {isLoading ? (
                  [...Array(8)].map((_, index) => (
                    <motion.div
                      key={`skeleton-${index}`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      className="bg-white/10 backdrop-blur-md rounded-lg overflow-hidden"
                    >
                      <div className="h-[300px] bg-white/5 animate-pulse" />
                      <div className="p-4 space-y-3">
                        <div className="h-6 bg-white/5 rounded animate-pulse" />
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <div className="h-6 w-16 bg-white/5 rounded animate-pulse" />
                            <div className="h-6 w-20 bg-white/5 rounded animate-pulse" />
                          </div>
                          <div className="h-4 bg-white/5 rounded animate-pulse" />
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : currentMovies.length > 0 ? (
                  currentMovies.map((movie, index) => (
                    <motion.div
                      key={movie.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.1 }}
                      whileHover={{
                        scale: 1.02,
                        transition: { duration: 0.2 },
                      }}
                    >
                      <Card
                        hoverable
                        cover={
                          <Image
                            alt={movie.title}
                            src={movie.image}
                            width={300}
                            height={450}
                            priority
                            className="h-[300px] object-cover"
                          />
                        }
                        className="!bg-white/10 backdrop-blur-md !border-white/20 overflow-hidden group"
                        bodyStyle={{ padding: '12px' }}
                        onClick={() => {
                          router.push(`/catalog/${movie.id}`);
                        }}
                      >
                        <Card.Meta
                          title={
                            <span className="!text-white group-hover:!text-blue-400 transition-colors">
                              {movie.title}
                            </span>
                          }
                          description={
                            <div className="space-y-2">
                              <div className="flex items-center gap-2">
                                <Tag color="blue">{movie.year}</Tag>
                                <Tag color="green">{movie.genre}</Tag>
                              </div>
                              <Rate
                                disabled
                                defaultValue={parseFloat(movie.rating)}
                                allowHalf
                                className="!text-yellow-500"
                              />
                            </div>
                          }
                        />
                      </Card>
                    </motion.div>
                  ))
                ) : (
                  <motion.div
                    initial={{ opacity: 0, scale: 1.5 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                  >
                    <div className="text-gray-300 p-4 mt-10 bg-white/15 animate-pulse rounded-lg">
                      <span>Ничего не найдено</span>
                    </div>
                  </motion.div>
                )}
              </div>
              {!isLoading && filteredMovies.length > 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  transition={{ duration: 0.5, delay: 0.2 }}
                  className="flex justify-center"
                >
                  <Pagination
                    current={currentPage}
                    onChange={setCurrentPage}
                    total={filteredMovies.length}
                    pageSize={pageSize}
                    showSizeChanger={false}
                  />
                </motion.div>
              )}
            </motion.div>
          </Content>
        </Layout>
      </div>
    </ConfigProvider>
  );
}
