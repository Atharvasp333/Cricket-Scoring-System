// Re-export all components from the Components directory
export * as Components from './Components';

// Export all icons from react-icons/fi and other icon libraries
import * as FiIcons from 'react-icons/fi';
import * as HiIcons from 'react-icons/hi';
import * as FaIcons from 'react-icons/fa';
import * as IoIcons from 'react-icons/io5';

export const Icons = {
  // Feather Icons (Fi)
  ...FiIcons,
  
  // Hero Icons (Hi)
  ...HiIcons,
  
  // Font Awesome (Fa)
  ...FaIcons,
  
  // Ionicons (Io)
  ...IoIcons,
  
  // Aliases for commonly used icons
  Close: FiIcons.FiX,
  Check: FiIcons.FiCheck,
  Search: FiIcons.FiSearch,
  User: FiIcons.FiUser,
  Home: FiIcons.FiHome,
  Calendar: FiIcons.FiCalendar,
  Award: FiIcons.FiAward,
  Chart: FiIcons.FiBarChart2,
  Settings: FiIcons.FiSettings,
  Logout: FiIcons.FiLogOut,
  Plus: FiIcons.FiPlus,
  Minus: FiIcons.FiMinus,
  Edit: FiIcons.FiEdit2,
  Trash: FiIcons.FiTrash2,
  Download: FiIcons.FiDownload,
  Upload: FiIcons.FiUpload,
  ArrowRight: FiIcons.FiArrowRight,
  ChevronRight: FiIcons.FiChevronRight,
  Clock: FiIcons.FiClock,
  Users: FiIcons.FiUsers,
  MapPin: FiIcons.FiMapPin,
  Refresh: FiIcons.FiRefreshCw,
  AlertCircle: FiIcons.FiAlertCircle,
  TrendingUp: FiIcons.FiTrendingUp,
  Phone: FiIcons.FiPhone,
  Eye: FiIcons.FiEye,
  Filter: FiIcons.FiFilter,
  ArrowLeft: FiIcons.FiArrowLeft
};
