import './elevator.scss'
import React, {
  FC, useCallback, useEffect, useLayoutEffect,
  useMemo, useRef, useState,
} from 'react'
import clsx from 'clsx'
import ResizeObserver from 'resize-observer-polyfill'
import smoothscroll from 'smoothscroll-polyfill'

smoothscroll.polyfill()

/** 通用 scrollEnd polyfill */
const waitForScrollEnd = (cb: () => void) => {
  let timer = 0
  const has = 'onscrollend' in window
  const clear = () => {
    window.removeEventListener('scroll', reset)
    window.removeEventListener('scrollend', onEnd)
    clearTimeout(timer)
  }
  const onEnd = () => {
    clear();
    cb()
  }
  const reset = () => {
    clearTimeout(timer);
    timer = window.setTimeout(onEnd, 480)
  }
  has
    ? window.addEventListener('scrollend', onEnd, {once: true})
    : (window.addEventListener('scroll', reset), reset())
}

/* ---------- Props ---------- */
export type ElevatorProps = {
  anchorPoints: string[]        // section id 数组
  anchorImages: string[]
  anchorActiveImages: string[]
  number: number                // 每屏 tab 数
  navbarHeight?: number         // 自定义 导航栏高度
  paddingTab?: number           // 自定义 距屏幕最上边间距
  // customise classname/style
  className?: string
  style?: React.CSSProperties
}

/* ---------- 组件 ---------- */
export const Elevator: FC<ElevatorProps> = ({
                                              anchorPoints,
                                              anchorImages,
                                              anchorActiveImages,
                                              number,
                                              navbarHeight,
                                              paddingTab,
                                              className,
                                              style
                                            }) => {
  /* ---------- tabs 数据 ---------- */
  const tabs = useMemo(() => {
    return anchorImages.map((img, i) => {
      const normal = new Image()
      const active = new Image()
      normal.src = img
      active.src = anchorActiveImages[i] || img
      return {
        id: anchorPoints[i] || '',
        img: normal,
        activeImg: active,
      }
    })
  }, [anchorPoints, anchorImages, anchorActiveImages])

  /* ---------- refs ---------- */
  const tabRefs = useRef<(HTMLDivElement | null)[]>([])
  const sectionRefs = useRef<(HTMLElement | null)[]>([])
  const elRef = useRef<HTMLDivElement>(null)
  const placeholderRef = useRef<HTMLDivElement | null>(null)
  const isProgrammatic = useRef(false)
  const offsetTopRef = useRef(0)

  console.log("paddingTab: ", paddingTab)
  /* ---------- state ---------- */
  const [active, setActive] = useState(0)
  const [deltaTop, setDeltaTop] = useState(0)

  /* ---------- deltaTop 计算 ---------- */
  const calcDeltaTop = useCallback(() => {
    const tabH = tabRefs.current[0]?.offsetHeight ?? navbarHeight ?? 75
    return tabH + (paddingTab ?? 0)
  }, [navbarHeight, paddingTab])

  /* ---------- 初始化 ---------- */
  useLayoutEffect(() => {
    sectionRefs.current = tabs.map(t => document.getElementById(t.id))
    setDeltaTop(calcDeltaTop())

    /* 监听首个 tab 尺寸变化 */
    const first = tabRefs.current[0]
    if (!first) return
    const ro = new ResizeObserver(() => setDeltaTop(calcDeltaTop()))
    ro.observe(first)
    return () => ro.disconnect()
  }, [tabs, calcDeltaTop])

  /* ---------- 居中当前 tab ---------- */
  const centerTab = useCallback((idx: number, smooth = false) => {
    const rail = elRef.current
    const cur = tabRefs.current[idx]
    if (!rail || !cur) return
    const left = Math.max(cur.offsetLeft - (rail.clientWidth - cur.offsetWidth) / 2, 0)
    smooth ? rail.scrollTo({left, behavior: 'smooth'}) : (rail.scrollLeft = left)
  }, [])

  /* ---------- ScrollSpy ---------- */
  useEffect(() => {
    let ticking = false
    const spy = () => {
      let idx = 0
      sectionRefs.current.forEach((sec, i) => {
        const rect = sec?.getBoundingClientRect()
        if (rect && rect.top < deltaTop + (deltaTop) * 0.2) idx = i
      })
      setActive(idx)
      ticking = false
    }
    const onScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(spy);
        ticking = true
      }
    }
    window.addEventListener('scroll', onScroll, {passive: true})
    return () => window.removeEventListener('scroll', onScroll)
  }, [deltaTop])

  /* ---------- scrollEnd：非手动时自动居中 ---------- */
  useEffect(() => {
    waitForScrollEnd(() => {
      if (!isProgrammatic.current) centerTab(active, true)
    })
  }, [active, centerTab])

  /* ---------- 视口尺寸变化 ---------- */
  useEffect(() => {
    const onResize = () => setDeltaTop(calcDeltaTop())
    window.addEventListener('resize', onResize, {passive: true})
    return () => window.removeEventListener('resize', onResize)
  }, [calcDeltaTop])

  /* ---------- 吸顶实现 ---------- */
  useEffect(() => {
    const el = elRef.current
    if (!el) return

    const recompute = () => {
      if (!el) return
      const navH = paddingTab ?? 0
      if (placeholderRef.current)
        placeholderRef.current.style.height = `${el.offsetHeight - navH}px`
      if (el.classList.contains('fixed')) {
        // 已吸顶 → 只更新 paddingTop 即刻生效
        el.style.paddingTop = `${navH}px`
      } else {
        // 未吸顶 → 重新计算触发点
        offsetTopRef.current = el.getBoundingClientRect().top + window.scrollY - navH
      }
      setDeltaTop(calcDeltaTop())
    }

    const ro = new ResizeObserver(recompute)
    ro.observe(el)

    const placeholder = document.createElement('div')
    placeholder.style.width = '100%'
    placeholder.style.visibility = 'hidden'
    placeholderRef.current = placeholder
    recompute()

    const onScroll = () => {
      const y = window.scrollY
      if (y >= offsetTopRef.current && offsetTopRef.current !== 0) {
        if (!el.classList.contains('fixed')) {
          el.parentNode?.insertBefore(placeholder, el)
          el.classList.add('fixed', 'safe-padding')
          el.style.paddingTop = `${paddingTab ?? 0}px`
        }
      } else if (el.classList.contains('fixed')) {
        el.classList.remove('fixed', 'safe-padding')
        placeholder.parentNode?.removeChild(placeholder)
        el.style.paddingTop = ''
      }
    }

    window.addEventListener('scroll', onScroll, {passive: true})
    return () => {
      ro.disconnect()
      window.removeEventListener('scroll', onScroll)
    }
  }, [calcDeltaTop, paddingTab])

  /* ---------- 点击 tab ---------- */
  const handleClick = (idx: number, id: string) => {
    const target = document.getElementById(id);
    if (!target) return;

    isProgrammatic.current = true;

    target.scrollIntoView({ behavior: 'smooth', block: 'start' });

    waitForScrollEnd(() => {
      isProgrammatic.current = false;
      centerTab(idx, true);
    });
  };


  /* ---------- render ---------- */
  return (
    <div ref={elRef} className={clsx('elevator', className)} style={style}>
      <div className="elevator-wrapper">
        {tabs.map((t, i) => (
          <div
            key={t.id}
            ref={el => (tabRefs.current[i] = el)}
            className="elevator-item-wrapper"
            style={{flex: `0 0 calc(100% / ${number})`}}
            onClick={() => handleClick(i, t.id)}
          >
            <img
              src={(active === i ? t.activeImg : t.img).src}
              alt=""
              className={clsx('elevator-item', active === i && 'elevator-item-active')}
            />
          </div>
        ))}
      </div>
    </div>
  )
}
