/// <reference types="cypress" />

/**
 * ElevatorNav 组件行为测试
 *
 * 先确保 `yarn dev` 启动示例站点 (http://localhost:5173)
 */

describe('ElevatorNav 行为', () => {
  beforeEach(() => {
    // 带 ?debug=1 可动态调节参数，也可去掉
    cy.visit('/?debug=1')
  })

  it('点击第二个 tab 应滚动至 section2', () => {
    cy.get('img[alt="sticky-elevator-tab-1"]').click()

    // 给滚动动画一点时间
    cy.wait(600)

    // 断言窗口已滚动到 section2 附近
    cy.window().its('scrollY').should('be.gt', 500)
  })

  it('手动滚动后应高亮第二个 tab', () => {
    // 滚到大概 section3 位置，确保 section2 进入视区
    cy.scrollTo(0, 1600, { duration: 400 })

    // 等待 raf + spy 更新
    cy.wait(200)

    cy.get('img[alt="sticky-elevator-tab-1"]')
      .should('have.class', 'elevator-item-active')
  })
})
