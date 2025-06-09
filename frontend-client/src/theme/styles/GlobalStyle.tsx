/** @jsxImportSource @emotion/react */
import { css, Global, useTheme } from '@emotion/react'
import '../fonts/fonts.css'

export function GlobalStyle() {
  const theme = useTheme()

  return (
    <Global
      styles={css`
        /* RESET */
        *,
        *::before,
        *::after {
          margin: 0;
          padding: 0;
          box-sizing: border-box;
        }

        html,
        body {
          width: 100%;
          height: 100%;
          font-family:
            'Pretendard Variable',
            Pretendard,
            -apple-system,
            BlinkMacSystemFont,
            'Segoe UI',
            Roboto,
            'Helvetica Neue',
            sans-serif;
          background-color: #ffffff;
          color: #000000;
        }

        a {
          text-decoration: none;
          color: inherit;
        }

        button {
          background: none;
          border: none;
          padding: 0;
          font: inherit;
          color: inherit;
          cursor: pointer;

          &:hover {
            opacity: 0.7;
          }

          &:focus {
            opacity: 1;
          }
        }

        a,
        input,
        label,
        textarea {
          &:hover {
            opacity: 0.7;
          }

          &:focus {
            opacity: 1;
          }
        }

        ul,
        ol {
          list-style: none;
        }

        img {
          max-width: 100%;
          display: block;
        }

        /* 접근성: 포커스 아웃라인 전역 스타일 */
        /* 기본 포커스 스타일 */
        :focus {
          outline: 2px solid ${theme.colors.tertiary};
          outline-offset: 2px;
          opacity: 1;
        }

        /* 포커스-보이기(focus-visible) 상태에 대한 스타일 (키보드 접근성) */
        :focus:not(:focus-visible) {
          outline: none;
        }

        :focus-visible {
          outline: 2px solid ${theme.colors.tertiary};
          outline-offset: 2px;
          box-shadow: 0 0 0 2px rgba(21, 101, 192, 0.2);
        }

        /* 버튼 요소 포커스 */
        button:focus,
        [role='button']:focus {
          outline: 2px solid ${theme.colors.tertiary};
          outline-offset: 1px;
        }

        /* 입력 폼 요소 포커스 */
        input:focus,
        textarea:focus,
        select:focus {
          outline: 2px solid ${theme.colors.tertiary};
          outline-offset: -1px;
        }

        /* 탭 요소 포커스 */
        [role='tab']:focus {
          outline: 2px solid ${theme.colors.tertiary};
          outline-offset: -2px;
        }

        /* 카드 및 목록 아이템 포커스 */
        [role='listitem']:focus {
          outline: 2px solid ${theme.colors.tertiary};
          background-color: rgba(0, 0, 0, 0.05);
        }

        /* 다크 배경에서의 포커스 스타일 */
        .dark-bg :focus,
        .dark-bg [role='button']:focus,
        .dark-bg [role='tab']:focus {
          outline-color: ${theme.colors.onSurface};
        }
      `}
    />
  )
}
