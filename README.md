## Slothy image - React component for progressive image loading

My personal attempt to implement image loading effect like Medium does. Images are lazy loaded only at the time when they are appearing on the screen. For the time when image is loaded the placeholder image is shown (or simple background). Internally implemented using React Hooks and IntersectionObserver which detects position of element in the viewport.
