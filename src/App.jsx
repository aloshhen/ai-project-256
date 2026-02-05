import { useState, useEffect, useCallback } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Camera, X, ChevronLeft, ChevronRight, Grid3X3, Image as ImageIcon, Heart, Share2, Download, Menu } from 'lucide-react'
import { clsx, ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

// Utility for tailwind class merging
function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

// SafeIcon component for Lucide icons
const SafeIcon = ({ name, size = 24, className = '', color }: { name: string; size?: number; className?: string; color?: string }) => {
  const iconMap: Record> = {
    Camera, X, ChevronLeft, ChevronRight, Grid3X3, Image: ImageIcon, Heart, Share2, Download, Menu
  }

  const IconComponent = iconMap[name] || ImageIcon

  return <IconComponent size={size} className={className} color={color} />
}

// Gallery data using user's uploaded images
const galleryImages = [
  {
    id: 1,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    title: 'Captured Moment',
    category: 'featured',
    aspectRatio: 'aspect-[3/4]',
    description: 'A beautiful moment frozen in time'
  },
  {
    id: 2,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    title: 'Natural Beauty',
    category: 'nature',
    aspectRatio: 'aspect-[4/3]',
    description: 'The essence of natural elegance'
  },
  {
    id: 3,
    src: 'https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?',
    title: 'Visual Story',
    category: 'portrait',
    aspectRatio: 'aspect-[3/4]',
    description: 'Every picture tells a story'
  },
  {
    id: 4,
    src: 'https://images.unsplash.com/photo-1493863641943-9b68992a8d07?w=800&q=80',
    title: 'Urban Exploration',
    category: 'urban',
    aspectRatio: 'aspect-[16/9]',
    description: 'Discovering city secrets'
  },
  {
    id: 5,
    src: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
    title: 'Mountain Peak',
    category: 'nature',
    aspectRatio: 'aspect-[4/5]',
    description: 'Above the clouds'
  },
  {
    id: 6,
    src: 'https://images.unsplash.com/photo-1518837695005-2083093ee35b?w=800&q=80',
    title: 'Ocean Dreams',
    category: 'nature',
    aspectRatio: 'aspect-[3/2]',
    description: 'Endless horizons'
  },
  {
    id: 7,
    src: 'https://images.unsplash.com/photo-1514565131-fce0801e5785?w=800&q=80',
    title: 'City Lights',
    category: 'urban',
    aspectRatio: 'aspect-[3/4]',
    description: 'Night comes alive'
  },
  {
    id: 8,
    src: 'https://images.unsplash.com/photo-1469474968028-56623f02e42e?w=800&q=80',
    title: 'Wilderness',
    category: 'nature',
    aspectRatio: 'aspect-[16/9]',
    description: 'Into the wild'
  }
]

const categories = [
  { id: 'all', label: 'All Photos', icon: 'Grid3X3' },
  { id: 'featured', label: 'Featured', icon: 'Heart' },
  { id: 'nature', label: 'Nature', icon: 'Image' },
  { id: 'urban', label: 'Urban', icon: 'Camera' },
  { id: 'portrait', label: 'Portrait', icon: 'Heart' }
]

function App() {
  const [activeCategory, setActiveCategory] = useState('all')
  const [selectedImage, setSelectedImage] = useState<typeof galleryImages[0] | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)

  // Filter images based on category
  const filteredImages = activeCategory === 'all'
    ? galleryImages
    : galleryImages.filter(img => img.category === activeCategory || (activeCategory === 'featured' && img.id <= 3))

  // Handle scroll effect for header
  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  // Keyboard navigation for lightbox
  const handleKeyDown = useCallback((e: KeyboardEvent) => {
    if (!selectedImage) return

    if (e.key === 'Escape') {
      setSelectedImage(null)
    } else if (e.key === 'ArrowLeft') {
      navigateImage(-1)
    } else if (e.key === 'ArrowRight') {
      navigateImage(1)
    }
  }, [selectedImage])

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown)
    return () => window.removeEventListener('keydown', handleKeyDown)
  }, [handleKeyDown])

  const openLightbox = (image: typeof galleryImages[0]) => {
    setSelectedImage(image)
    const index = filteredImages.findIndex(img => img.id === image.id)
    setCurrentImageIndex(index)
  }

  const navigateImage = (direction) => {
    const newIndex = currentImageIndex + direction
    if (newIndex >= 0 && newIndex < filteredImages.length) {
      setCurrentImageIndex(newIndex)
      setSelectedImage(filteredImages[newIndex])
    }
  }

  return (
    <div className="min-h-screen bg-slate-950 text-white overflow-x-hidden">
      {/* Header */}
      <header
        className={cn(
          'fixed top-0 left-0 right-0 z-50 transition-all duration-300',
          isScrolled ? 'bg-slate-950/90 backdrop-blur-xl border-b border-slate-800/50' : 'bg-transparent'
        )}
      >
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16 md:h-20">
            {/* Logo */}
            <a href="#" className="flex items-center gap-3 group">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center group-hover:scale-110 transition-transform">
                <SafeIcon name="Camera" size={20} className="text-white" />
              </div>
              <span className="text-xl md:text-2xl font-bold tracking-tight">
                Visual<span className="text-indigo-400">Gallery</span>
              </span>
            </a>

            {/* Desktop Navigation */}
            <nav className="hidden md:flex items-center gap-8">
              {['Gallery', 'About', 'Contact'].map((item) => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-sm font-medium text-slate-400 hover:text-white transition-colors relative group"
                >
                  {item}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-500 group-hover:w-full transition-all duration-300" />
                </a>
              ))}
            </nav>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden w-10 h-10 flex items-center justify-center rounded-lg hover:bg-slate-800 transition-colors"
            >
              <SafeIcon name={isMenuOpen ? 'X' : 'Menu'} size={24} className="text-white" />
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="md:hidden bg-slate-950/95 backdrop-blur-xl border-b border-slate-800"
            >
              <nav className="container mx-auto px-4 py-4 flex flex-col gap-2">
                {['Gallery', 'About', 'Contact'].map((item) => (
                  <a
                    key={item}
                    href={`#${item.toLowerCase()}`}
                    onClick={() => setIsMenuOpen(false)}
                    className="py-3 px-4 text-slate-300 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
                  >
                    {item}
                  </a>
                ))}
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </header>

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center justify-center pt-20 overflow-hidden">
        {/* Background Gradient */}
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-900/50 to-slate-950 z-0" />

        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-indigo-600/20 rounded-full blur-3xl animate-pulse" />
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-purple-600/20 rounded-full blur-3xl animate-pulse delay-1000" />
        </div>

        {/* Hero Content */}
        <div className="relative z-10 container mx-auto px-4 md:px-6 lg:px-8 py-20">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center max-w-4xl mx-auto"
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.2, duration: 0.5 }}
              className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-slate-800/50 border border-slate-700/50 mb-8 backdrop-blur-sm"
            >
              <SafeIcon name="Camera" size={16} className="text-indigo-400" />
              <span className="text-sm font-medium text-slate-300">Photography Portfolio</span>
            </motion.div>

            <h1 className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter mb-6 leading-tight">
              Capturing{' '}
              <span className="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">
                Moments
              </span>
              <br />
              That Matter
            </h1>

            <p className="text-lg md:text-xl text-slate-400 max-w-2xl mx-auto mb-10 leading-relaxed">
              A curated collection of visual stories, exploring the beauty of light, shadow, and emotion through the lens.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => document.getElementById('gallery')?.scrollIntoView({ behavior: 'smooth' })}
                className="px-8 py-4 bg-gradient-to-r from-indigo-600 to-purple-600 rounded-full font-semibold text-white shadow-lg shadow-indigo-600/25 hover:shadow-indigo-600/40 transition-shadow flex items-center justify-center gap-2"
              >
                <SafeIcon name="Grid3X3" size={20} />
                View Gallery
              </motion.button>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="px-8 py-4 bg-slate-800/50 border border-slate-700 rounded-full font-semibold text-white hover:bg-slate-800 transition-colors backdrop-blur-sm"
              >
                Learn More
              </motion.button>
            </div>
          </motion.div>

          {/* Featured Image Preview */}
          <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="mt-16 relative max-w-5xl mx-auto"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-600/20 border border-slate-800">
              <img
                src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?"
                alt="Featured Gallery Image"
                className="w-full h-auto max-h-[60vh] object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-transparent to-transparent" />
              <div className="absolute bottom-6 left-6 right-6">
                <p className="text-sm font-medium text-indigo-400 mb-1">Featured Work</p>
                <h3 className="text-2xl font-bold text-white">Your Captured Memories</h3>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          {/* Section Header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-12"
          >
            <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tighter mb-4">
              Photo <span className="text-indigo-400">Gallery</span>
            </h2>
            <p className="text-slate-400 text-lg max-w-2xl mx-auto">
              Browse through our collection of carefully curated photographs across different categories
            </p>
          </motion.div>

          {/* Category Filters */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.1 }}
            className="flex flex-wrap justify-center gap-2 md:gap-3 mb-12 no-scrollbar overflow-x-auto pb-2"
          >
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={cn(
                  'flex items-center gap-2 px-4 md:px-6 py-2.5 md:py-3 rounded-full text-sm font-medium transition-all duration-300 whitespace-nowrap',
                  activeCategory === category.id
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/25'
                    : 'bg-slate-800/50 text-slate-400 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                )}
              >
                <SafeIcon
                  name={category.icon}
                  size={16}
                  className={activeCategory === category.id ? 'text-white' : 'text-slate-500'}
                />
                {category.label}
              </button>
            ))}
          </motion.div>

          {/* Gallery Grid */}
          <motion.div
            layout
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6"
          >
            <AnimatePresence mode="popLayout">
              {filteredImages.map((image, index) => (
                <motion.div
                  key={image.id}
                  layout
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="group relative overflow-hidden rounded-xl cursor-pointer"
                  onClick={() => openLightbox(image)}
                >
                  <div className={cn('relative overflow-hidden rounded-xl bg-slate-800', image.aspectRatio)}>
                    <img
                      src={image.src}
                      alt={image.title}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />

                    {/* Overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                    {/* Content */}
                    <div className="absolute inset-0 p-4 flex flex-col justify-end opacity-0 group-hover:opacity-100 transition-all duration-300 translate-y-4 group-hover:translate-y-0">
                      <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider mb-1">
                        {image.category}
                      </span>
                      <h3 className="text-lg font-bold text-white mb-1">{image.title}</h3>
                      <p className="text-sm text-slate-300 line-clamp-2">{image.description}</p>
                    </div>

                    {/* Hover Border Effect */}
                    <div className="absolute inset-0 rounded-xl border-2 border-indigo-500/0 group-hover:border-indigo-500/50 transition-colors duration-300" />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>
          </motion.div>

          {/* Empty State */}
          {filteredImages.length === 0 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-center py-20"
            >
              <SafeIcon name="Image" size={48} className="text-slate-600 mx-auto mb-4" />
              <p className="text-slate-400">No images found in this category</p>
            </motion.div>
          )}
        </div>
      </section>

      {/* About Section */}
      <section id="about" className="py-20 md:py-32 bg-slate-900/30 relative">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-950 to-slate-900/50 pointer-events-none" />

        <div className="container mx-auto px-4 md:px-6 lg:px-8 relative">
          <div className="grid md:grid-cols-2 gap-12 md:gap-20 items-center">
            <motion.div
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <span className="text-indigo-400 font-semibold mb-4 block">About The Gallery</span>
              <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
                Visual Stories Worth <span className="text-indigo-400">Sharing</span>
              </h2>
              <p className="text-slate-400 text-lg leading-relaxed mb-6">
                Every photograph in this gallery captures a unique moment in time. From breathtaking landscapes to intimate portraits, each image tells a story that words cannot express.
              </p>
              <p className="text-slate-400 text-lg leading-relaxed mb-8">
                Our collection spans various categories including nature, urban exploration, and artistic portraits, showcasing the beauty found in everyday moments.
              </p>

              <div className="grid grid-cols-3 gap-6">
                {[
                  { value: '500+', label: 'Photos' },
                  { value: '50+', label: 'Categories' },
                  { value: '10K+', label: 'Views' }
                ].map((stat) => (
                  <div key={stat.label} className="text-center md:text-left">
                    <div className="text-2xl md:text-3xl font-black text-white mb-1">{stat.value}</div>
                    <div className="text-sm text-slate-500">{stat.label}</div>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="relative"
            >
              <div className="relative rounded-2xl overflow-hidden shadow-2xl shadow-indigo-600/20">
                <img
                  src="https://oejgkvftpbinliuopipr.supabase.co/storage/v1/object/public/assets/user_347995964/user-photo-1.jpg?"
                  alt="About Gallery"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/20 to-purple-600/20" />
              </div>

              {/* Floating Badge */}
              <div className="absolute -bottom-6 -left-6 bg-slate-800 rounded-xl p-4 shadow-xl border border-slate-700">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                    <SafeIcon name="Heart" size={24} className="text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-white">Curated with Love</div>
                    <div className="text-xs text-slate-400">Premium Selection</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section id="contact" className="py-20 md:py-32 relative">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl mx-auto text-center"
          >
            <h2 className="text-4xl md:text-5xl font-black tracking-tighter mb-6">
              Get In <span className="text-indigo-400">Touch</span>
            </h2>
            <p className="text-slate-400 text-lg mb-8">
              Interested in collaborating or licensing images? Reach out to us.
            </p>

            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href="mailto:hello@visualgallery.com"
                className="px-8 py-4 bg-indigo-600 hover:bg-indigo-700 rounded-full font-semibold text-white transition-colors inline-flex items-center justify-center gap-2"
              >
                <SafeIcon name="Share2" size={20} />
                Contact Us
              </a>

              <button className="px-8 py-4 bg-slate-800 hover:bg-slate-700 rounded-full font-semibold text-white transition-colors inline-flex items-center justify-center gap-2">
                <SafeIcon name="Download" size={20} />
                Download Portfolio
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 border-t border-slate-800/50 bg-slate-950">
        <div className="container mx-auto px-4 md:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row justify-between items-center gap-6">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-600 flex items-center justify-center">
                <SafeIcon name="Camera" size={16} className="text-white" />
              </div>
              <span className="text-lg font-bold">Visual<span className="text-indigo-400">Gallery</span></span>
            </div>

            <nav className="flex items-center gap-6 text-sm text-slate-400">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">License</a>
            </nav>

            <p className="text-sm text-slate-500">
              © 2024 Visual Gallery. All rights reserved.
            </p>
          </div>
        </div>
      </footer>

      {/* Lightbox */}
      <AnimatePresence>
        {selectedImage && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="fixed inset-0 z-[100] bg-slate-950/95 backdrop-blur-xl flex items-center justify-center"
            onClick={() => setSelectedImage(null)}
          >
            {/* Close Button */}
            <button
              onClick={() => setSelectedImage(null)}
              className="absolute top-4 right-4 md:top-8 md:right-8 w-12 h-12 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-800 text-white transition-colors z-10"
            >
              <SafeIcon name="X" size={24} />
            </button>

            {/* Navigation */}
            {currentImageIndex > 0 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage(-1)
                }}
                className="absolute left-4 md:left-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-800 text-white transition-colors z-10"
              >
                <SafeIcon name="ChevronLeft" size={24} />
              </button>
            )}

            {currentImageIndex < filteredImages.length - 1 && (
              <button
                onClick={(e) => {
                  e.stopPropagation()
                  navigateImage(1)
                }}
                className="absolute right-4 md:right-8 top-1/2 -translate-y-1/2 w-12 h-12 md:w-14 md:h-14 flex items-center justify-center rounded-full bg-slate-800/50 hover:bg-slate-800 text-white transition-colors z-10"
              >
                <SafeIcon name="ChevronRight" size={24} />
              </button>
            )}

            {/* Image Container */}
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ duration: 0.3 }}
              className="relative max-w-5xl max-h-[85vh] mx-4 md:mx-12"
              onClick={(e) => e.stopPropagation()}
            >
              <img
                src={selectedImage.src}
                alt={selectedImage.title}
                className="max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl"
              />

              {/* Image Info */}
              <div className="absolute bottom-0 left-0 right-0 p-6 bg-gradient-to-t from-slate-950 to-transparent rounded-b-lg">
                <span className="text-xs font-medium text-indigo-400 uppercase tracking-wider">
                  {selectedImage.category}
                </span>
                <h3 className="text-xl md:text-2xl font-bold text-white mt-1">
                  {selectedImage.title}
                </h3>
                <p className="text-slate-300 mt-2 text-sm md:text-base">
                  {selectedImage.description}
                </p>

                {/* Image Counter */}
                <div className="mt-4 text-sm text-slate-500">
                  {currentImageIndex + 1} / {filteredImages.length}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default App