// Component inspired by: "react-simple-pull-to-refresh" (https://www.npmjs.com/package/react-simple-pull-to-refresh)
import type { QueryObserverResult } from '@tanstack/react-query';
import React, { useEffect, useRef } from 'react';
import { CustomSpinner } from '../loader/Style';
import { FlexCenterer } from '../positionModifiers/centerers/FlexCenterer';
import { DIRECTION } from './helpers/direction';
import { isTreeScrollable } from './helpers/isScrollable';
import './styles/main.scss';
import './styles/refreshingcontent.scss';

interface PullToRefreshProps {
   onRefresh: () => Promise<void | QueryObserverResult<unknown>>;
   children: JSX.Element;
   isDarkTheme: boolean;
}

export default function PullToRefresh(props: PullToRefreshProps): JSX.Element {
   const { onRefresh, children, isDarkTheme } = props;
   const resistance = 1;
   const maxPullDownDistance = 70;
   const pullDownThreshold = 70;
   const containerRef = useRef<HTMLDivElement>(null);
   const childrenRef = useRef<HTMLDivElement>(null);
   const pullDownRef = useRef<HTMLDivElement>(null);
   let pullToRefreshThresholdBreached: boolean = false;
   let isDragging: boolean = false;
   let startY: number = 0;
   let currentY: number = 0;

   useEffect(() => {
      if (!childrenRef || !childrenRef.current) return;
      const childrenEl = childrenRef.current;
      childrenEl.addEventListener('touchstart', onTouchStart, { passive: true });
      childrenEl.addEventListener('mousedown', onTouchStart);
      childrenEl.addEventListener('touchmove', onTouchMove, { passive: false });
      childrenEl.addEventListener('mousemove', onTouchMove);
      childrenEl.addEventListener('touchend', onEnd);
      childrenEl.addEventListener('mouseup', onEnd);
      document.body.addEventListener('mouseleave', onEnd);

      return () => {
         childrenEl.removeEventListener('touchstart', onTouchStart);
         childrenEl.removeEventListener('mousedown', onTouchStart);
         childrenEl.removeEventListener('touchmove', onTouchMove);
         childrenEl.removeEventListener('mousemove', onTouchMove);
         childrenEl.removeEventListener('touchend', onEnd);
         childrenEl.removeEventListener('mouseup', onEnd);
         document.body.removeEventListener('mouseleave', onEnd);
      };
   }, [children, onRefresh, pullDownThreshold, maxPullDownDistance]);

   const initContainer = (): void => {
      requestAnimationFrame(() => {
         if (childrenRef.current) {
            childrenRef.current.style.overflowX = 'hidden';
            childrenRef.current.style.overflowY = 'auto';
            childrenRef.current.style.transform = `unset`;
         }
         if (pullDownRef.current) {
            pullDownRef.current.style.opacity = '0';
         }
         if (containerRef.current) {
            containerRef.current.classList.remove('ptr--pull-down-treshold-breached');
            containerRef.current.classList.remove('ptr--dragging');
            containerRef.current.classList.remove('ptr--fetch-more-treshold-breached');
         }
         if (pullToRefreshThresholdBreached) pullToRefreshThresholdBreached = false;
      });
   };

   const onTouchStart = (e: MouseEvent | TouchEvent): void => {
      isDragging = false;
      if (e instanceof MouseEvent) {
         startY = e.pageY;
      }
      if (window.TouchEvent && e instanceof TouchEvent) {
         startY = e.touches[0].pageY;
      }
      currentY = startY;
      if (e.type === 'touchstart' && isTreeScrollable(e.target as HTMLElement, DIRECTION.UP)) {
         return;
      }
      if (childrenRef.current!.getBoundingClientRect().top < 0) {
         return;
      }
      isDragging = true;
   };

   const onTouchMove = (e: MouseEvent | TouchEvent): void => {
      if (!isDragging) {
         return;
      }

      if (window.TouchEvent && e instanceof TouchEvent) {
         currentY = e.touches[0].pageY;
      } else {
         currentY = (e as MouseEvent).pageY;
      }

      containerRef.current!.classList.add('ptr--dragging');

      if (currentY < startY) {
         isDragging = false;
         return;
      }

      if (e.cancelable) {
         e.preventDefault();
      }

      const yDistanceMoved = Math.min((currentY - startY) / resistance, maxPullDownDistance);

      if (yDistanceMoved >= pullDownThreshold) {
         isDragging = true;
         pullToRefreshThresholdBreached = true;
         containerRef.current!.classList.remove('ptr--dragging');
         containerRef.current!.classList.add('ptr--pull-down-treshold-breached');
      }

      if (yDistanceMoved >= maxPullDownDistance) {
         return;
      }
      pullDownRef.current!.style.opacity = (yDistanceMoved / 65).toString();
      childrenRef.current!.style.overflow = 'visible';
      childrenRef.current!.style.transform = `translate(0px, ${yDistanceMoved}px)`;
      pullDownRef.current!.style.visibility = 'visible';
   };

   const onEnd = (): void => {
      isDragging = false;
      startY = 0;
      currentY = 0;

      if (!pullToRefreshThresholdBreached) {
         if (pullDownRef.current) pullDownRef.current.style.visibility = 'hidden';
         initContainer();
         return;
      }

      if (childrenRef.current) {
         childrenRef.current.style.overflow = 'visible';
         childrenRef.current.style.transform = `translate(0px, ${pullDownThreshold}px)`;
      }
      onRefresh().then(initContainer).catch(initContainer);
   };

   return (
      <div className={`ptr`} ref={containerRef}>
         <div className="ptr__pull-down" ref={pullDownRef}>
            <div className="ptr__loader ptr__pull-down--loading">
               {' '}
               <FlexCenterer>
                  <CustomSpinner
                     isDarkTheme={isDarkTheme}
                     sizePx={'20px'}
                     style={{ marginTop: '1em', marginBottom: '1em' }}
                  />
               </FlexCenterer>
            </div>
            <div className="ptr__pull-down--pull-more">
               <FlexCenterer>
                  <CustomSpinner
                     isDarkTheme={isDarkTheme}
                     sizePx={'20px'}
                     disableSpin
                     style={{ marginTop: '1em', marginBottom: '1em' }}
                  />
               </FlexCenterer>
            </div>
         </div>
         <div className="ptr__children" ref={childrenRef}>
            {children}
         </div>
      </div>
   );
}
