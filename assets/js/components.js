/**
 * Component rendering system for the learning platform
 * Handles dynamic content generation based on JSON configuration
 */

// Component renderers object
const ComponentRenderers = {
    
    /**
     * Render hero component
     */
    hero: (data) => {
        const { title, subtitle, description, backgroundImage, buttons = [] } = data;
        
        return `
            <section class="relative bg-gradient-to-br from-primary-orange to-accent-orange text-white py-20 px-6 rounded-lg mb-8 overflow-hidden">
                ${backgroundImage ? `<div class="absolute inset-0 bg-cover bg-center opacity-20" style="background-image: url('${backgroundImage}');"></div>` : ''}
                <div class="relative z-10 max-w-4xl mx-auto text-center">
                    <h1 class="text-4xl md:text-6xl font-bold mb-4">${title}</h1>
                    ${subtitle ? `<h2 class="text-xl md:text-2xl font-light mb-6 text-orange-100">${subtitle}</h2>` : ''}
                    ${description ? `<p class="text-lg md:text-xl mb-8 text-orange-50 max-w-2xl mx-auto">${description}</p>` : ''}
                    ${buttons.length > 0 ? `
                        <div class="flex flex-col sm:flex-row gap-4 justify-center">
                            ${buttons.map(btn => `
                                <a href="${btn.url}" class="inline-flex items-center px-6 py-3 ${btn.primary ? 'bg-white text-primary-orange hover:bg-gray-100' : 'border-2 border-white text-white hover:bg-white hover:text-primary-orange'} font-semibold rounded-lg transition-colors duration-300">
                                    ${btn.icon ? `<i class="${btn.icon} mr-2"></i>` : ''}
                                    ${btn.text}
                                </a>
                            `).join('')}
                        </div>
                    ` : ''}
                </div>
            </section>
        `;
    },

    /**
     * Render text component
     */
    text: (data) => {
        const { content, align = 'left', size = 'base' } = data;
        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
        const sizeClass = size === 'large' ? 'text-lg' : size === 'small' ? 'text-sm' : 'text-base';
        
        return `
            <div class="prose prose-lg dark:prose-invert max-w-none mb-6">
                <div class="${alignClass} ${sizeClass}">${content}</div>
            </div>
        `;
    },

    /**
     * Render code component with syntax highlighting
     */
    code: (data) => {
        const { 
            title, 
            description, 
            code, 
            filePath, 
            language = 'javascript', 
            showLineNumbers = true, 
            highlightLines = [], 
            showPreview = false,
            showShare = true,
            downloadable = true
        } = data;
        
        const codeId = `code-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
        
        return `
            <div class="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-6">
                ${title ? `<h3 class="text-xl font-semibold mb-2">${title}</h3>` : ''}
                ${description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${description}</p>` : ''}
                
                <div class="relative">
                    <!-- Code Header -->
                    <div class="flex items-center justify-between bg-gray-700 text-white px-4 py-2 rounded-t-lg">
                        <span class="text-sm font-mono">${filePath || `code.${language}`}</span>
                        <div class="flex items-center space-x-2">
                            ${downloadable && filePath ? `
                                <button onclick="downloadCode('${filePath}', '${codeId}')" class="p-1 hover:bg-gray-600 rounded" title="Download">
                                    <i class="fas fa-download text-sm"></i>
                                </button>
                            ` : ''}
                            <button onclick="copyCode('${codeId}')" class="p-1 hover:bg-gray-600 rounded" title="Copy Code">
                                <i class="fas fa-copy text-sm"></i>
                            </button>
                            ${showShare ? `
                                <button class="share-button p-1 hover:bg-gray-600 rounded" data-share-type="link" data-share-text="Check out this code example" title="Share">
                                    <i class="fas fa-share text-sm"></i>
                                </button>
                            ` : ''}
                        </div>
                    </div>
                    
                    <!-- Code Content -->
                    <pre class="!mt-0 !rounded-t-none"><code id="${codeId}" class="language-${language}">${code || 'Loading...'}</code></pre>
                </div>
                
                ${showPreview ? `
                    <div class="mt-4 p-4 border border-gray-200 dark:border-gray-600 rounded-lg">
                        <h4 class="font-semibold mb-2">Preview:</h4>
                        <div class="preview-content bg-white dark:bg-gray-900 p-4 rounded border">
                            <!-- Preview akan di-render sesuai dengan tipe kode -->
                        </div>
                    </div>
                ` : ''}
            </div>
        `;
    },

    /**
     * Render video component (YouTube embed)
     */
    video: (data) => {
        const { title, description, videoId, aspectRatio = '16:9' } = data;
        const paddingClass = aspectRatio === '16:9' ? 'pb-[56.25%]' : aspectRatio === '4:3' ? 'pb-[75%]' : 'pb-[56.25%]';
        
        return `
            <div class="mb-6">
                ${title ? `<h3 class="text-xl font-semibold mb-2">${title}</h3>` : ''}
                ${description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${description}</p>` : ''}
                
                <div class="relative ${paddingClass} bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden">
                    <iframe 
                        class="absolute inset-0 w-full h-full"
                        src="https://www.youtube.com/embed/${videoId}?rel=0&modestbranding=1"
                        title="${title || 'Video'}"
                        frameborder="0"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowfullscreen>
                    </iframe>
                </div>
            </div>
        `;
    },

    /**
     * Render image component
     */
    image: (data) => {
        const { src, alt, caption, width = 'full', align = 'center' } = data;
        const widthClass = width === 'full' ? 'w-full' : width === 'half' ? 'w-1/2' : width === 'third' ? 'w-1/3' : 'w-full';
        const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : 'mr-auto';
        
        return `
            <figure class="mb-6 ${alignClass} ${widthClass}">
                <img src="${src}" alt="${alt}" class="w-full h-auto rounded-lg shadow-md" loading="lazy">
                ${caption ? `<figcaption class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2">${caption}</figcaption>` : ''}
            </figure>
        `;
    },

    /**
     * Render alert component
     */
    alert: (data) => {
        const { type = 'info', title, content, dismissible = false } = data;
        const alertId = `alert-${Date.now()}`;
        
        const typeClasses = {
            info: 'bg-blue-50 border-blue-200 text-blue-800 dark:bg-blue-900/20 dark:border-blue-800 dark:text-blue-200',
            success: 'bg-green-50 border-green-200 text-green-800 dark:bg-green-900/20 dark:border-green-800 dark:text-green-200',
            warning: 'bg-yellow-50 border-yellow-200 text-yellow-800 dark:bg-yellow-900/20 dark:border-yellow-800 dark:text-yellow-200',
            error: 'bg-red-50 border-red-200 text-red-800 dark:bg-red-900/20 dark:border-red-800 dark:text-red-200'
        };
        
        const iconClasses = {
            info: 'fas fa-info-circle',
            success: 'fas fa-check-circle',
            warning: 'fas fa-exclamation-triangle',
            error: 'fas fa-times-circle'
        };
        
        return `
            <div id="${alertId}" class="border-l-4 p-4 mb-6 ${typeClasses[type]} rounded-r-lg">
                <div class="flex items-start">
                    <div class="flex-shrink-0">
                        <i class="${iconClasses[type]} text-lg"></i>
                    </div>
                    <div class="ml-3 flex-1">
                        ${title ? `<h4 class="font-semibold mb-1">${title}</h4>` : ''}
                        <div>${content}</div>
                    </div>
                    ${dismissible ? `
                        <button onclick="document.getElementById('${alertId}').remove()" class="flex-shrink-0 ml-3 opacity-70 hover:opacity-100">
                            <i class="fas fa-times"></i>
                        </button>
                    ` : ''}
                </div>
            </div>
        `;
    },

    /**
     * Render list component
     */
    list: (data) => {
        const { type = 'unordered', items, title } = data;
        const listTag = type === 'ordered' ? 'ol' : 'ul';
        const listClass = type === 'ordered' ? 'list-decimal list-inside' : 'list-disc list-inside';
        
        return `
            <div class="mb-6">
                ${title ? `<h3 class="text-xl font-semibold mb-3">${title}</h3>` : ''}
                <${listTag} class="${listClass} space-y-2 text-gray-700 dark:text-gray-300">
                    ${items.map(item => `<li>${item}</li>`).join('')}
                </${listTag}>
            </div>
        `;
    },

    /**
     * Render accordion component
     */
    accordion: (data) => {
        const { items, allowMultiple = false } = data;
        const accordionId = `accordion-${Date.now()}`;
        
        return `
            <div class="space-y-2 mb-6" data-accordion="${accordionId}" data-multiple="${allowMultiple}">
                ${items.map((item, index) => {
                    const itemId = `${accordionId}-item-${index}`;
                    return `
                        <div class="border border-gray-200 dark:border-gray-700 rounded-lg">
                            <button 
                                class="accordion-toggle w-full px-4 py-3 text-left flex items-center justify-between bg-gray-50 dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 rounded-lg"
                                data-target="${itemId}"
                                onclick="toggleAccordion('${itemId}', '${accordionId}', ${allowMultiple})"
                            >
                                <span class="font-medium">${item.title}</span>
                                <i class="fas fa-chevron-down transform transition-transform duration-200"></i>
                            </button>
                            <div id="${itemId}" class="accordion-content hidden px-4 py-3 border-t border-gray-200 dark:border-gray-700">
                                ${item.content}
                            </div>
                        </div>
                    `;
                }).join('')}
            </div>
        `;
    },

    /**
     * Render quiz component
     */
    quiz: (data) => {
        const { title, questions } = data;
        const quizId = `quiz-${Date.now()}`;
        
        return `
            <div class="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 rounded-lg p-6 mb-6">
                <h3 class="text-xl font-semibold mb-4 flex items-center">
                    <i class="fas fa-question-circle text-blue-500 mr-2"></i>
                    ${title}
                </h3>
                
                <form id="${quizId}" class="space-y-6">
                    ${questions.map((q, qIndex) => {
                        const questionId = `${quizId}-q${qIndex}`;
                        
                        if (q.type === 'multiple-choice') {
                            return `
                                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                    <h4 class="font-medium mb-3">${qIndex + 1}. ${q.question}</h4>
                                    <div class="space-y-2">
                                        ${q.options.map((option, oIndex) => `
                                            <label class="flex items-center p-2 hover:bg-gray-50 dark:hover:bg-gray-700 rounded cursor-pointer">
                                                <input type="radio" name="${questionId}" value="${oIndex}" class="mr-3 text-blue-500">
                                                <span>${option}</span>
                                            </label>
                                        `).join('')}
                                    </div>
                                </div>
                            `;
                        } else if (q.type === 'text') {
                            return `
                                <div class="bg-white dark:bg-gray-800 p-4 rounded-lg">
                                    <h4 class="font-medium mb-3">${qIndex + 1}. ${q.question}</h4>
                                    <textarea 
                                        name="${questionId}" 
                                        rows="3" 
                                        class="w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                                        placeholder="Tulis jawaban Anda di sini..."
                                    ></textarea>
                                </div>
                            `;
                        }
                        return '';
                    }).join('')}
                    
                    <div class="flex justify-between items-center pt-4">
                        <button type="button" onclick="submitQuiz('${quizId}')" class="bg-blue-500 hover:bg-blue-600 text-white px-6 py-2 rounded-lg font-medium transition-colors">
                            Submit Quiz
                        </button>
                        <div id="${quizId}-result" class="text-sm font-medium"></div>
                    </div>
                </form>
            </div>
        `;
    },

    /**
     * Render table component
     */
    table: (data) => {
        const { title, headers, rows, responsive = true } = data;
        
        return `
            <div class="mb-6">
                ${title ? `<h3 class="text-xl font-semibold mb-4">${title}</h3>` : ''}
                
                <div class="${responsive ? 'overflow-x-auto' : ''}">
                    <table class="min-w-full bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden">
                        <thead class="bg-gray-50 dark:bg-gray-700">
                            <tr>
                                ${headers.map(header => `
                                    <th class="px-4 py-3 text-left font-medium text-gray-900 dark:text-gray-100">${header}</th>
                                `).join('')}
                            </tr>
                        </thead>
                        <tbody class="divide-y divide-gray-200 dark:divide-gray-700">
                            ${rows.map(row => `
                                <tr class="hover:bg-gray-50 dark:hover:bg-gray-700">
                                    ${row.map(cell => `
                                        <td class="px-4 py-3 text-gray-700 dark:text-gray-300">${cell}</td>
                                    `).join('')}
                                </tr>
                            `).join('')}
                        </tbody>
                    </table>
                </div>
            </div>
        `;
    },

    /**
     * Render card grid component
     */
    card: (data) => {
        const { title, cards, columns = 3 } = data;
        const gridClass = `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`;
        
        return `
            <div class="mb-6">
                ${title ? `<h3 class="text-xl font-semibold mb-6">${title}</h3>` : ''}
                
                <div class="grid ${gridClass} gap-6">
                    ${cards.map(card => `
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                            ${card.image ? `
                                <img src="${card.image}" alt="${card.title}" class="w-full h-48 object-cover">
                            ` : ''}
                            <div class="p-6">
                                <h4 class="text-lg font-semibold mb-2">${card.title}</h4>
                                ${card.description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${card.description}</p>` : ''}
                                ${card.buttons ? `
                                    <div class="flex space-x-2">
                                        ${card.buttons.map(btn => `
                                            <a href="${btn.url}" class="inline-flex items-center px-4 py-2 ${btn.primary ? 'bg-primary-orange text-white' : 'border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300'} rounded-lg hover:opacity-80 transition-opacity">
                                                ${btn.icon ? `<i class="${btn.icon} mr-2"></i>` : ''}
                                                ${btn.text}
                                            </a>
                                        `).join('')}
                                    </div>
                                ` : ''}
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    },

    /**
     * Render timeline component
     */
    timeline: (data) => {
        const { title, items } = data;
        
        return `
            <div class="mb-6">
                ${title ? `<h3 class="text-xl font-semibold mb-6">${title}</h3>` : ''}
                
                <div class="relative">
                    <!-- Timeline line -->
                    <div class="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-300 dark:bg-gray-600"></div>
                    
                    <div class="space-y-8">
                        ${items.map((item, index) => `
                            <div class="relative flex items-start">
                                <!-- Timeline dot -->
                                <div class="flex-shrink-0 w-8 h-8 bg-primary-orange rounded-full flex items-center justify-center z-10">
                                    <span class="text-white text-sm font-bold">${index + 1}</span>
                                </div>
                                
                                <!-- Content -->
                                <div class="ml-6 flex-1">
                                    <h4 class="text-lg font-semibold">${item.title}</h4>
                                    ${item.subtitle ? `<p class="text-sm text-gray-500 dark:text-gray-400 mb-2">${item.subtitle}</p>` : ''}
                                    <p class="text-gray-700 dark:text-gray-300">${item.description}</p>
                                    ${item.link ? `
                                        <a href="${item.link.url}" class="inline-flex items-center mt-3 text-primary-orange hover:text-accent-orange">
                                            ${item.link.text}
                                            <i class="fas fa-arrow-right ml-2"></i>
                                        </a>
                                    ` : ''}
                                </div>
                            </div>
                        `).join('')}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render download section component
     */
    download: (data) => {
        const { title, description, files } = data;
        
        return `
            <div class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 mb-6">
                <div class="flex items-center mb-4">
                    <i class="fas fa-download text-green-500 text-xl mr-3"></i>
                    <h3 class="text-xl font-semibold">${title}</h3>
                </div>
                
                ${description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${description}</p>` : ''}
                
                <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
                    ${files.map(file => `
                        <a href="${file.url}" download class="flex items-center p-4 bg-white dark:bg-gray-800 rounded-lg hover:shadow-md transition-shadow group">
                            <div class="flex-shrink-0 w-10 h-10 bg-green-100 dark:bg-green-900/30 rounded-lg flex items-center justify-center mr-4">
                                <i class="fas fa-file-${file.type || 'code'} text-green-600 dark:text-green-400"></i>
                            </div>
                            <div class="flex-1">
                                <h4 class="font-medium group-hover:text-green-600 dark:group-hover:text-green-400">${file.name}</h4>
                                <p class="text-sm text-gray-500 dark:text-gray-400">${file.description || file.size || ''}</p>
                            </div>
                            <i class="fas fa-download text-gray-400 group-hover:text-green-600 dark:group-hover:text-green-400"></i>
                        </a>
                    `).join('')}
                </div>
            </div>
        `;
    }
};

/**
 * Render a single component based on its type and data
 */
function renderComponent(component) {
    const { type, data, id } = component;
    
    if (!ComponentRenderers[type]) {
        console.warn(`Unknown component type: ${type}`);
        return `<div class="p-4 bg-red-100 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg mb-4">
            <p class="text-red-600 dark:text-red-400">Unknown component type: ${type}</p>
        </div>`;
    }
    
    const renderedHTML = ComponentRenderers[type](data);
    
    // Wrap with component container if ID is provided
    if (id) {
        return `<div id="${id}" class="component-container" data-component-type="${type}">${renderedHTML}</div>`;
    }
    
    return renderedHTML;
}

/**
 * Render multiple components
 */
function renderComponents(components) {
    return components.map(component => renderComponent(component)).join('');
}

// Interactive functions for components

/**
 * Copy code to clipboard
 */
function copyCode(codeId) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;
    
    const code = codeElement.textContent;
    navigator.clipboard.writeText(code).then(() => {
        // Show feedback
        const button = event.target.closest('button');
        const originalIcon = button.innerHTML;
        button.innerHTML = '<i class="fas fa-check text-sm"></i>';
        button.classList.add('bg-green-600');
        
        setTimeout(() => {
            button.innerHTML = originalIcon;
            button.classList.remove('bg-green-600');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code: ', err);
    });
}

/**
 * Download code file
 */
function downloadCode(filePath, codeId) {
    // In a real implementation, this would fetch the file from the server
    // For now, we'll create a blob from the code content
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;
    
    const code = codeElement.textContent;
    const blob = new Blob([code], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    a.download = filePath.split('/').pop();
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
}

/**
 * Toggle accordion item
 */
function toggleAccordion(itemId, accordionId, allowMultiple) {
    const item = document.getElementById(itemId);
    const button = document.querySelector(`[data-target="${itemId}"]`);
    const icon = button.querySelector('i');
    
    if (!allowMultiple) {
        // Close all other items in this accordion
        const accordion = document.querySelector(`[data-accordion="${accordionId}"]`);
        const allItems = accordion.querySelectorAll('.accordion-content');
        const allButtons = accordion.querySelectorAll('.accordion-toggle i');
        
        allItems.forEach(otherItem => {
            if (otherItem.id !== itemId) {
                otherItem.classList.add('hidden');
            }
        });
        
        allButtons.forEach(otherIcon => {
            if (otherIcon !== icon) {
                otherIcon.classList.remove('rotate-180');
            }
        });
    }
    
    // Toggle current item
    item.classList.toggle('hidden');
    icon.classList.toggle('rotate-180');
}

/**
 * Submit quiz and calculate score
 */
function submitQuiz(quizId) {
    const form = document.getElementById(quizId);
    const formData = new FormData(form);
    const resultDiv = document.getElementById(`${quizId}-result`);
    
    // This is a basic implementation
    // In a real app, you would validate against correct answers
    let answeredQuestions = 0;
    let totalQuestions = form.querySelectorAll('[name]').length;
    
    for (let [name, value] of formData.entries()) {
        if (value.trim() !== '') {
            answeredQuestions++;
        }
    }
    
    const completionRate = Math.round((answeredQuestions / totalQuestions) * 100);
    
    resultDiv.innerHTML = `
        <span class="text-green-600 dark:text-green-400">
            <i class="fas fa-check-circle mr-1"></i>
            Quiz submitted! Completion: ${completionRate}%
        </span>
    `;
    
    // Disable form
    const inputs = form.querySelectorAll('input, textarea, button');
    inputs.forEach(input => input.disabled = true);
}

// Export for global use
window.ComponentRenderers = ComponentRenderers;
window.renderComponent = renderComponent;
window.renderComponents = renderComponents;
window.copyCode = copyCode;
window.downloadCode = downloadCode;
window.toggleAccordion = toggleAccordion;
window.submitQuiz = submitQuiz;
