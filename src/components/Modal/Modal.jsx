// src/components/Modal/Modal.jsx
import React, { useEffect, useRef, useCallback } from 'react';
import { createPortal } from 'react-dom';

// Импортируем стили модалки
import styles from './Modal.module.css';

function Modal({ isOpen, onClose, title, children, footer }) {
  const modalRef = useRef(null);

  // Обработка клавиши Escape
  const handleKeyDown = useCallback(
    (event) => {
      if (event.key === 'Escape' && isOpen) {
        onClose();
      }
    },
    [isOpen, onClose]
  );

  // Добавляем/убираем обработчик клавиши Escape
  useEffect(() => {
    if (isOpen) {
      document.addEventListener('keydown', handleKeyDown);
      // Блокируем скролл body
      document.body.style.overflow = 'hidden';
    }

    return () => {
      document.removeEventListener('keydown', handleKeyDown);
      // Возвращаем скролл body
      document.body.style.overflow = '';
    };
  }, [isOpen, handleKeyDown]);

  // Обработка клика на overlay
  const handleOverlayClick = (event) => {
    // Закрываем только если клик был на overlay, а не на самой модалке
    if (modalRef.current && !modalRef.current.contains(event.target)) {
      onClose();
    }
  };

  // Не рендерим, если модалка закрыта
  if (!isOpen) {
    return null;
  }

  // Контент модалки
  const modalContent = (
    <div className={styles.overlay} onClick={handleOverlayClick}>
      <div
        ref={modalRef}
        className={styles.modal}
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        {/* Заголовок */}
        {title && (
          <div className={styles.header}>
            <h2 id="modal-title" className={styles.title}>
              {title}
            </h2>
            <button
              className={styles.closeButton}
              onClick={onClose}
              aria-label="Закрыть"
            >
              ×
            </button>
          </div>
        )}

        {/* Контент */}
        <div className={styles.content}>{children}</div>

        {/* Футер (кнопки действий) */}
        {footer && <div className={styles.footer}>{footer}</div>}
      </div>
    </div>
  );

  // Рендерим через Portal в body
  return createPortal(modalContent, document.body);
}

export default Modal;