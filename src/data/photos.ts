import type { ImageMetadata } from 'astro';
import afterImg from '../assets/work/after.jpg';
import beforeImg from '../assets/work/before.jpg';
import teamImg from '../assets/work/team.jpg';
import work1 from '../assets/work/work1.jpg';
import work2 from '../assets/work/work2.jpg';
import work3 from '../assets/work/work3.jpg';
import work4 from '../assets/work/work4.jpg';
import work5 from '../assets/work/work5.jpg';
import work6 from '../assets/work/work6.jpg';
import work7 from '../assets/work/work7.jpg';
import work8 from '../assets/work/work8.jpg';

export type Photo = { src: ImageMetadata; alt: string };

export const hero: Photo = { src: work3, alt: 'Jack working on an outboard engine at the dock' };
export const about: Photo = { src: teamImg, alt: 'Jack on the dock with two boaters in front of a sportfishing boat' };
export const before: Photo = { src: beforeImg, alt: 'Before: corroded, tangled wiring in a boat compartment' };
export const after: Photo = { src: afterImg, alt: 'After: clean, neatly routed wiring in the same compartment' };

export const gallery: Photo[] = [
  { src: work3, alt: 'Jack working on an outboard engine with the cover off' },
  { src: work1, alt: 'Jack wiring a center console helm under a blue T-top' },
  { src: work6, alt: 'Twin 350 horsepower outboards on the back of a boat' },
  { src: work2, alt: 'Lit-up GPS and electronics displays at a boat helm' },
  { src: work7, alt: 'Three new batteries installed with fresh wiring below' },
  { src: work4, alt: 'Jack kneeling to work on an outboard engine' },
  { src: work5, alt: 'Brand-new starter next to the old corroded one it replaced' },
  { src: work8, alt: 'Twin outboard engines with the covers off, over the water' },
];
