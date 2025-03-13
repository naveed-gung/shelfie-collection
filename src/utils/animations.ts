import { Variants } from "framer-motion";

// Staggered fade-in animation for lists and grids
export const staggerContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

// Item animation for staggered containers
export const staggerItem: Variants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

// Fade in animation
export const fadeIn: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      duration: 0.3
    }
  }
};

// Scale animation for cards and buttons
export const scaleUp: Variants = {
  hidden: { scale: 0.95, opacity: 0 },
  visible: {
    scale: 1,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 300,
      damping: 15
    }
  }
};

// Slide in from right
export const slideInRight: Variants = {
  hidden: { x: 100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Slide in from left
export const slideInLeft: Variants = {
  hidden: { x: -100, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100,
      damping: 15
    }
  }
};

// Pulse animation for highlighting elements
export const pulse: Variants = {
  initial: { scale: 1 },
  pulse: {
    scale: [1, 1.05, 1],
    transition: {
      duration: 0.6,
      repeat: Infinity,
      repeatType: "reverse"
    }
  }
};

// Hover animations for interactive elements
export const hoverScale = {
  scale: 1.05,
  transition: {
    type: "spring",
    stiffness: 300,
    damping: 10
  }
};

// Page transition
export const pageTransition: Variants = {
  initial: { opacity: 0 },
  animate: { 
    opacity: 1,
    transition: { 
      duration: 0.3,
      when: "beforeChildren",
      staggerChildren: 0.1
    }
  },
  exit: { 
    opacity: 0,
    transition: { duration: 0.2 }
  }
};

// BOOK CARD ANIMATIONS

// Book card grid container
export const bookGridContainer: Variants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08
    }
  }
};

// Book card appearing from shelf (for grid view)
export const bookCardGrid: Variants = {
  hidden: { y: 30, opacity: 0, rotateX: "10deg" },
  visible: {
    y: 0,
    opacity: 1,
    rotateX: "0deg",
    transition: {
      type: "spring",
      stiffness: 260,
      damping: 20
    }
  }
};

// Book card appearing for list view
export const bookCardList: Variants = {
  hidden: { x: -30, opacity: 0 },
  visible: {
    x: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 200,
      damping: 20
    }
  }
};

// Book cover hover effect
export const bookCoverHover = {
  rest: { 
    scale: 1,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)",
    transition: { 
      duration: 0.2,
      type: "tween",
      ease: "easeOut"
    }
  },
  hover: { 
    scale: 1.05,
    boxShadow: "0px 10px 20px rgba(0, 0, 0, 0.2)",
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  },
  tap: { 
    scale: 0.98,
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    transition: { 
      duration: 0.15
    }
  }
};

// Book spine effect
export const bookSpineEffect: Variants = {
  rest: { 
    rotateY: 0,
    boxShadow: "0px 0px 0px rgba(153, 93, 51, 0)"
  },
  hover: { 
    rotateY: 15,
    boxShadow: "-5px 0px 10px rgba(153, 93, 51, 0.3)",
    transition: { 
      duration: 0.3,
      type: "spring",
      stiffness: 300,
      damping: 10
    }
  }
};

// Book page flip effect
export const bookPageFlip: Variants = {
  initial: { rotateY: 0 },
  flip: {
    rotateY: [0, 180],
    transition: {
      duration: 0.8,
      ease: "easeInOut"
    }
  }
};

// Book rating stars animation
export const ratingStarsAnimation: Variants = {
  initial: { scale: 1, opacity: 0.7 },
  animate: {
    scale: [1, 1.2, 1],
    opacity: 1,
    transition: {
      duration: 0.5,
      ease: "easeInOut"
    }
  }
};

// Filter/sort animation
export const filterAnimation: Variants = {
  collapsed: { height: 0, opacity: 0 },
  expanded: { 
    height: "auto", 
    opacity: 1,
    transition: {
      height: {
        duration: 0.3
      },
      opacity: {
        duration: 0.25,
        delay: 0.05
      }
    }
  }
};

// Book removal animation
export const bookRemovalAnimation: Variants = {
  initial: { scale: 1, opacity: 1 },
  exit: {
    scale: 0.8,
    opacity: 0,
    transition: {
      duration: 0.3,
      ease: "easeInOut"
    }
  }
};

// Book selection animation
export const bookSelectionAnimation: Variants = {
  unselected: { 
    scale: 1,
    y: 0,
    boxShadow: "0px 5px 15px rgba(0, 0, 0, 0.1)"
  },
  selected: { 
    scale: 1.03,
    y: -5,
    boxShadow: "0px 15px 25px rgba(153, 93, 51, 0.3)",
    transition: {
      type: "spring",
      stiffness: 400,
      damping: 15
    }
  }
};
