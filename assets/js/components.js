/**
 * Component rendering system for the learning platform
 * Handles dynamic content generation based on JSON configuration
 */

// Utility functions
function escapeHtml(text) {
    const div = document.createElement('div');
    div.textContent = text;
    return div.innerHTML;
}

function generateId() {
    return `id-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
}

function getFileName(filePath) {
    if (!filePath) return 'code.txt';
    // Extract filename from path, handle both forward and backward slashes
    return filePath.split(/[/\\]/).pop();
}

function sanitizeFilePath(filePath) {
    if (!filePath) return '';
    // Return only the filename for display, but keep original path for fetching
    return getFileName(filePath);
}

/**
 * Generate constant section ID from section name
 * This ensures consistent IDs for section navigation
 */
function generateSectionId(sectionName, componentType = '') {
    if (!sectionName) return generateId();
    
    // Convert to lowercase, replace spaces/special chars with hyphens
    const cleanName = sectionName
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
        .replace(/\s+/g, '-')         // Replace spaces with hyphens
        .replace(/-+/g, '-')          // Replace multiple hyphens with single
        .replace(/^-|-$/g, '');       // Remove leading/trailing hyphens
    
    // Add component type prefix if provided
    const prefix = componentType ? `${componentType}-` : '';
    
    return `${prefix}${cleanName}`;
}

// File reading utility
async function readCodeFile(filePath) {
    try {
        const response = await fetch(filePath);
        if (!response.ok) {
            throw new Error(`HTTP ${response.status}: ${response.statusText}`);
        }
        return await response.text();
    } catch (error) {
        console.error(`Failed to read file: ${filePath}`, error);
        return `// Error: Could not load file ${getFileName(filePath)}\n// ${error.message}`;
    }
}

// Component renderers object
const ComponentRenderers = {
    
    /**
     * Render hero component
     */
    hero: (data) => {
        const { title, subtitle, description, backgroundImage, buttons = [], sectionId, sectionName } = data;
        const heroId = sectionId || generateSectionId(sectionName || title, 'hero');
        
        return `
            <section id="${heroId}" class="relative bg-gradient-to-br from-primary-orange to-accent-orange text-white py-20 px-6 rounded-lg mb-8 overflow-hidden">
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
        const { content, align = 'left', size = 'base', sectionId, sectionName } = data;
        const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : 'text-left';
        const sizeClass = size === 'large' ? 'text-lg' : size === 'small' ? 'text-sm' : 'text-base';
        const textId = sectionId || generateSectionId(sectionName, 'text');
        
        return `
            <div id="${textId}" class="prose prose-lg dark:prose-invert max-w-none mb-6">
                <div class="${alignClass} ${sizeClass}">${content}</div>
            </div>
        `;
    },

    /**
     * Render code component with file reading and enhanced UI
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
            downloadable = true,
            sectionId,
            sectionName
        } = data;
        
        const codeId = generateId();
        const loaderId = `loader-${codeId}`;
        const containerId = sectionId || generateSectionId(sectionName || title, 'code');
        const displayFileName = sanitizeFilePath(filePath) || `code.${language}`;
        
        // Initialize code loading
        setTimeout(async () => {
            let codeContent = code;
            
            // Read from file if filePath is provided and no code content
            if (filePath && !code) {
                const loader = document.getElementById(loaderId);
                if (loader) loader.style.display = 'flex';
                
                codeContent = await readCodeFile(filePath);
                
                if (loader) loader.style.display = 'none';
            }
            
            const codeElement = document.getElementById(codeId);
            if (codeElement) {
                codeElement.textContent = codeContent;
                // Re-highlight syntax if Prism.js is available
                if (typeof Prism !== 'undefined') {
                    Prism.highlightElement(codeElement);
                }
            }
        }, 100);
        
        return `
            <div id="${containerId}" class="bg-white dark:bg-gray-900 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 mb-6 overflow-hidden">
                ${title ? `<div class="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
                    <div class="flex items-center justify-between">
                        <div>
                            <h3 class="text-xl font-semibold text-gray-900 dark:text-white">${title}</h3>
                            ${description ? `<p class="text-gray-600 dark:text-gray-300 mt-1">${description}</p>` : ''}
                        </div>
                        <button onclick="shareSection('${containerId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-primary-orange rounded-lg transition-colors duration-200" 
                                title="Share this section">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                </div>` : ''}
                
                <div class="relative">
                    <!-- Code Header -->
                    <div class="flex items-center justify-between bg-gray-800 dark:bg-gray-900 text-white px-4 py-3">
                        <div class="flex items-center space-x-3">
                            <div class="flex space-x-1">
                                <div class="w-3 h-3 bg-red-500 rounded-full"></div>
                                <div class="w-3 h-3 bg-yellow-500 rounded-full"></div>
                                <div class="w-3 h-3 bg-green-500 rounded-full"></div>
                            </div>
                            <span class="text-sm font-mono text-gray-300">${displayFileName}</span>
                        </div>
                        <div class="flex items-center space-x-2">
                            ${downloadable ? `
                                <button onclick="downloadCodeFile('${filePath}', '${codeId}')" 
                                        class="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 group" 
                                        title="Download File">
                                    <i class="fas fa-download text-sm group-hover:text-blue-400"></i>
                                </button>
                            ` : ''}
                            <button onclick="copyCodeToClipboard('${codeId}')" 
                                    class="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 group" 
                                    title="Copy Code">
                                <i class="fas fa-copy text-sm group-hover:text-green-400"></i>
                            </button>
                            ${showShare ? `
                                <button onclick="shareCode('${codeId}', '${title || 'Code Example'}')" 
                                        class="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 group" 
                                        title="Share Code">
                                    <i class="fas fa-share-alt text-sm group-hover:text-purple-400"></i>
                                </button>
                            ` : ''}
                            <button onclick="toggleFullscreen('${codeId}')" 
                                    class="p-2 hover:bg-gray-700 rounded-lg transition-colors duration-200 group" 
                                    title="Toggle Fullscreen">
                                <i class="fas fa-expand text-sm group-hover:text-orange-400"></i>
                            </button>
                        </div>
                    </div>
                    
                    <!-- Loading indicator -->
                    <div id="${loaderId}" class="hidden absolute inset-0 bg-gray-100 dark:bg-gray-800 flex items-center justify-center z-10">
                        <div class="flex items-center space-x-2 text-gray-600 dark:text-gray-400">
                            <div class="animate-spin rounded-full h-5 w-5 border-b-2 border-primary-orange"></div>
                            <span>Loading code...</span>
                        </div>
                    </div>
                    
                    <!-- Code Content -->
                    <div class="relative">
                        <pre class="!mt-0 !mb-0 overflow-x-auto bg-gray-50 dark:bg-gray-800" style="max-height: 600px;"><code id="${codeId}" class="language-${language} ${showLineNumbers ? 'line-numbers' : ''}">${code || 'Loading...'}</code></pre>
                        
                        ${highlightLines.length > 0 ? `
                            <div class="absolute inset-0 pointer-events-none">
                                ${highlightLines.map(line => `
                                    <div class="absolute left-0 right-0 bg-yellow-200 dark:bg-yellow-900/30 opacity-30" 
                                         style="top: ${(line - 1) * 1.5}rem; height: 1.5rem;"></div>
                                `).join('')}
                            </div>
                        ` : ''}
                    </div>
                </div>
                
                ${showPreview ? `
                    <div class="border-t border-gray-200 dark:border-gray-700 p-6">
                        <div class="flex items-center justify-between mb-4">
                            <h4 class="font-semibold text-gray-900 dark:text-white">Preview</h4>
                            <button onclick="refreshPreview('${codeId}')" class="text-sm text-primary-orange hover:text-accent-orange">
                                <i class="fas fa-refresh mr-1"></i>Refresh
                            </button>
                        </div>
                        <div id="preview-${codeId}" class="preview-content bg-white dark:bg-gray-900 p-4 rounded-lg border border-gray-200 dark:border-gray-600 min-h-[100px]">
                            <!-- Preview content will be rendered here -->
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
        const { title, description, videoId, aspectRatio = '16:9', sectionId, sectionName } = data;
        const paddingClass = aspectRatio === '16:9' ? 'pb-[56.25%]' : aspectRatio === '4:3' ? 'pb-[75%]' : 'pb-[56.25%]';
        const containerId = sectionId || generateSectionId(sectionName || title, 'video');
        
        return `
            <div id="${containerId}" class="mb-6">
                ${title ? `
                    <div class="flex items-center justify-between mb-2">
                        <h3 class="text-xl font-semibold">${title}</h3>
                        <button onclick="shareSection('${containerId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-primary-orange rounded-lg transition-colors duration-200" 
                                title="Share this section">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                ` : ''}
                ${description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${description}</p>` : ''}
                
                <div class="relative ${paddingClass} bg-gray-200 dark:bg-gray-800 rounded-lg overflow-hidden shadow-lg">
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
        const { src, alt, caption, width = 'full', align = 'center', sectionId, sectionName } = data;
        const widthClass = width === 'full' ? 'w-full' : width === 'half' ? 'w-1/2' : width === 'third' ? 'w-1/3' : 'w-full';
        const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : 'mr-auto';
        const containerId = sectionId || generateSectionId(sectionName || alt, 'image');
        
        return `
            <figure id="${containerId}" class="mb-6 ${alignClass} ${widthClass}">
                <img src="${src}" alt="${alt}" class="w-full h-auto rounded-lg shadow-md" loading="lazy">
                ${caption ? `
                    <figcaption class="text-sm text-gray-600 dark:text-gray-400 text-center mt-2 flex items-center justify-between">
                        <span>${caption}</span>
                        <button onclick="shareSection('${containerId}', '${alt}')" 
                                class="p-1 text-gray-400 hover:text-primary-orange rounded transition-colors duration-200" 
                                title="Share this image">
                            <i class="fas fa-share-alt text-xs"></i>
                        </button>
                    </figcaption>
                ` : ''}
            </figure>
        `;
    },

    /**
     * Render alert component
     */
    alert: (data) => {
        const { type = 'info', title, content, dismissible = false, sectionId, sectionName } = data;
        const alertId = sectionId || generateSectionId(sectionName || title, 'alert');
        
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
                    <div class="flex space-x-1">
                        <button onclick="shareSection('${alertId}', '${title || 'Alert'}')" 
                                class="flex-shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity" 
                                title="Share this alert">
                            <i class="fas fa-share-alt text-sm"></i>
                        </button>
                        ${dismissible ? `
                            <button onclick="dismissAlert('${alertId}')" class="flex-shrink-0 p-1 opacity-70 hover:opacity-100 transition-opacity">
                                <i class="fas fa-times text-sm"></i>
                            </button>
                        ` : ''}
                    </div>
                </div>
            </div>
        `;
    },

    /**
     * Render list component
     */
    list: (data) => {
        const { type = 'unordered', items, title, sectionId, sectionName } = data;
        const listTag = type === 'ordered' ? 'ol' : 'ul';
        const listClass = type === 'ordered' ? 'list-decimal list-inside' : 'list-disc list-inside';
        const containerId = sectionId || generateSectionId(sectionName || title, 'list');
        
        return `
            <div id="${containerId}" class="mb-6">
                ${title ? `
                    <div class="flex items-center justify-between mb-3">
                        <h3 class="text-xl font-semibold">${title}</h3>
                        <button onclick="shareSection('${containerId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-primary-orange rounded-lg transition-colors duration-200" 
                                title="Share this section">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                ` : ''}
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
        const { items, allowMultiple = false, title, sectionId, sectionName } = data;
        const accordionId = sectionId || generateSectionId(sectionName || title || 'accordion', 'accordion');
        
        return `
            <div id="${accordionId}" class="space-y-2 mb-6" data-accordion="${accordionId}" data-multiple="${allowMultiple}">
                <div class="flex items-center justify-between mb-4">
                    <h3 class="text-xl font-semibold">${title || 'Accordion'}</h3>
                    <button onclick="shareSection('${accordionId}', '${title || 'Accordion'}')" 
                            class="p-2 text-gray-500 hover:text-primary-orange rounded-lg transition-colors duration-200" 
                            title="Share this section">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
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
     * Render table component
     */
    table: (data) => {
        const { title, headers, rows, responsive = true, sectionId, sectionName } = data;
        const containerId = sectionId || generateSectionId(sectionName || title, 'table');
        
        return `
            <div id="${containerId}" class="mb-6">
                ${title ? `
                    <div class="flex items-center justify-between mb-4">
                        <h3 class="text-xl font-semibold">${title}</h3>
                        <button onclick="shareSection('${containerId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-primary-orange rounded-lg transition-colors duration-200" 
                                title="Share this section">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                ` : ''}
                
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
     * Render card grid component (UPDATED - removed difficulty and duration)
     */
    card: (data) => {
        const { title, cards, columns = 3, sectionId, sectionName } = data;
        const gridClass = `grid-cols-1 md:grid-cols-2 lg:grid-cols-${columns}`;
        const containerId = sectionId || generateSectionId(sectionName || title, 'card');
        
        return `
            <div id="${containerId}" class="mb-6">
                ${title ? `
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold">${title}</h3>
                        <button onclick="shareSection('${containerId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-primary-orange rounded-lg transition-colors duration-200" 
                                title="Share this section">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                ` : ''}
                
                <div class="grid ${gridClass} gap-6">
                    ${cards.map(card => `
                        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-md hover:shadow-lg transition-shadow duration-300 overflow-hidden">
                            ${card.image ? `
                                <img src="${card.image}" alt="${card.title}" class="w-full h-48 object-cover">
                            ` : ''}
                            <div class="p-6">
                                <h4 class="text-lg font-semibold mb-2">${card.title}</h4>
                                ${card.description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${card.description}</p>` : ''}
                                ${card.buttons && card.buttons.length > 0 ? `
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
        const { title, items, sectionId, sectionName } = data;
        const containerId = sectionId || generateSectionId(sectionName || title, 'timeline');
        
        return `
            <div id="${containerId}" class="mb-6">
                ${title ? `
                    <div class="flex items-center justify-between mb-6">
                        <h3 class="text-xl font-semibold">${title}</h3>
                        <button onclick="shareSection('${containerId}', '${title}')" 
                                class="p-2 text-gray-500 hover:text-primary-orange rounded-lg transition-colors duration-200" 
                                title="Share this section">
                            <i class="fas fa-share-alt"></i>
                        </button>
                    </div>
                ` : ''}
                
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
     * Render completion section
     */
    completion: (data) => {
        const { title, description, nextModule, sectionId, sectionName } = data;
        const containerId = sectionId || generateSectionId(sectionName || title, 'completion');
        
        return `
            <div id="${containerId}" class="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 rounded-lg p-6 mb-6">
                <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center">
                        <i class="fas fa-trophy text-green-500 text-2xl mr-3"></i>
                        <h3 class="text-xl font-semibold">${title}</h3>
                    </div>
                    <button onclick="shareSection('${containerId}', '${title}')" 
                            class="p-2 text-gray-500 hover:text-primary-orange rounded-lg transition-colors duration-200" 
                            title="Share this achievement">
                        <i class="fas fa-share-alt"></i>
                    </button>
                </div>
                
                ${description ? `<p class="text-gray-600 dark:text-gray-300 mb-4">${description}</p>` : ''}
                
                ${nextModule ? `
                    <a href="${nextModule.url}" class="inline-flex items-center px-6 py-3 bg-primary-orange text-white rounded-lg hover:bg-accent-orange transition-colors duration-300">
                        ${nextModule.text}
                        <i class="fas fa-arrow-right ml-2"></i>
                    </a>
                ` : ''}
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

// Enhanced Interactive functions for components

/**
 * Copy code to clipboard with better feedback
 */
function copyCodeToClipboard(codeId) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;
    
    const code = codeElement.textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        // Show feedback with toast notification
        showToast('Code copied to clipboard!', 'success');
        
        // Update button icon temporarily
        const button = event.target.closest('button');
        const icon = button.querySelector('i');
        const originalClass = icon.className;
        
        icon.className = 'fas fa-check text-sm';
        button.classList.add('bg-green-600');
        
        setTimeout(() => {
            icon.className = originalClass;
            button.classList.remove('bg-green-600');
        }, 2000);
    }).catch(err => {
        console.error('Failed to copy code: ', err);
        showToast('Failed to copy code', 'error');
    });
}

/**
 * Download code file with proper handling
 */
function downloadCodeFile(filePath, codeId) {
    if (filePath) {
        // Download from actual file path
        const link = document.createElement('a');
        link.href = filePath;
        link.download = getFileName(filePath);
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        
        showToast('Download started!', 'success');
    } else {
        // Download from code content
        const codeElement = document.getElementById(codeId);
        if (!codeElement) return;
        
        const code = codeElement.textContent;
        const blob = new Blob([code], { type: 'text/plain' });
        const url = URL.createObjectURL(blob);
        
        const link = document.createElement('a');
        link.href = url;
        link.download = 'code.txt';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
        URL.revokeObjectURL(url);
        
        showToast('Code downloaded!', 'success');
    }
}

/**
 * Share code with Web Share API or fallback
 */
function shareCode(codeId, title) {
    const codeElement = document.getElementById(codeId);
    if (!codeElement) return;
    
    const code = codeElement.textContent;
    const shareData = {
        title: title,
        text: `Check out this code example: ${title}`,
        url: window.location.href
    };
    
    if (navigator.share) {
        navigator.share(shareData).then(() => {
            showToast('Code shared successfully!', 'success');
        }).catch(err => {
            console.error('Error sharing:', err);
            fallbackShare(shareData, code);
        });
    } else {
        fallbackShare(shareData, code);
    }
}

/**
 * Share specific section with URL parameter
 */
function shareSection(sectionId, title) {
    const currentUrl = new URL(window.location);
    currentUrl.searchParams.set('section', sectionId);
    
    const shareData = {
        title: title,
        text: `Check out this section: ${title}`,
        url: currentUrl.toString()
    };
    
    if (navigator.share) {
        navigator.share(shareData).then(() => {
            showToast('Section shared successfully!', 'success');
        }).catch(err => {
            console.error('Error sharing:', err);
            fallbackShare(shareData);
        });
    } else {
        fallbackShare(shareData);
    }
}

/**
 * Copy current page URL or section URL to clipboard
 */
function copyPageUrl(sectionId = null) {
    const currentUrl = new URL(window.location);
    if (sectionId) {
        currentUrl.searchParams.set('section', sectionId);
    }
    
    navigator.clipboard.writeText(currentUrl.toString()).then(() => {
        showToast('URL copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy URL: ', err);
        showToast('Failed to copy URL', 'error');
    });
}

/**
 * Fallback share method
 */
function fallbackShare(shareData, code = null) {
    // Create share modal
    const modal = document.createElement('div');
    modal.className = 'fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50';
    modal.innerHTML = `
        <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full mx-4">
            <h3 class="text-lg font-semibold mb-4">Share ${shareData.title}</h3>
            <div class="space-y-3">
                <button onclick="copyToClipboard('${shareData.url}'); closeModal(this)" 
                        class="w-full flex items-center justify-center px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600">
                    <i class="fas fa-link mr-2"></i>Copy Link
                </button>
                <button onclick="shareToTwitter('${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}'); closeModal(this)" 
                        class="w-full flex items-center justify-center px-4 py-2 bg-blue-400 text-white rounded-lg hover:bg-blue-500">
                    <i class="fab fa-twitter mr-2"></i>Share on Twitter
                </button>
                <button onclick="shareToLinkedIn('${encodeURIComponent(shareData.text)}', '${encodeURIComponent(shareData.url)}'); closeModal(this)" 
                        class="w-full flex items-center justify-center px-4 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800">
                    <i class="fab fa-linkedin mr-2"></i>Share on LinkedIn
                </button>
                <button onclick="closeModal(this)" 
                        class="w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-700">
                    Cancel
                </button>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    
    // Close on backdrop click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            document.body.removeChild(modal);
        }
    });
}

/**
 * Toggle fullscreen for code block
 */
function toggleFullscreen(codeId) {
    const codeContainer = document.getElementById(codeId).closest('.component-container') || 
                         document.getElementById(codeId).closest('div[class*="bg-white"]');
    if (!codeContainer) return;
    
    if (codeContainer.classList.contains('fullscreen-code')) {
        // Exit fullscreen
        codeContainer.classList.remove('fullscreen-code');
        document.body.classList.remove('overflow-hidden');
    } else {
        // Enter fullscreen
        codeContainer.classList.add('fullscreen-code');
        document.body.classList.add('overflow-hidden');
    }
}

/**
 * Refresh preview for code component
 */
function refreshPreview(codeId) {
    const previewContainer = document.getElementById(`preview-${codeId}`);
    if (!previewContainer) return;
    
    const codeElement = document.getElementById(codeId);
    const code = codeElement.textContent;
    
    // Basic HTML preview (you can extend this for other languages)
    if (codeElement.classList.contains('language-html')) {
        previewContainer.innerHTML = code;
    } else if (codeElement.classList.contains('language-css')) {
        previewContainer.innerHTML = `<style>${code}</style><div>CSS applied to this preview</div>`;
    } else {
        previewContainer.innerHTML = '<p class="text-gray-500">Preview not available for this language</p>';
    }
}

/**
 * Dismiss alert with animation
 */
function dismissAlert(alertId) {
    const alert = document.getElementById(alertId);
    if (!alert) return;
    
    alert.style.transition = 'opacity 0.3s ease-out, transform 0.3s ease-out';
    alert.style.opacity = '0';
    alert.style.transform = 'translateX(100%)';
    
    setTimeout(() => {
        alert.remove();
    }, 300);
}

/**
 * Toggle accordion item with improved animation
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
            if (otherItem.id !== itemId && !otherItem.classList.contains('hidden')) {
                otherItem.classList.add('hidden');
            }
        });
        
        allButtons.forEach(otherIcon => {
            if (otherIcon !== icon) {
                otherIcon.classList.remove('rotate-180');
            }
        });
    }
    
    // Toggle current item with smooth animation
    if (item.classList.contains('hidden')) {
        item.classList.remove('hidden');
        item.style.maxHeight = '0px';
        item.style.overflow = 'hidden';
        item.style.transition = 'max-height 0.3s ease-out';
        
        // Force reflow
        item.offsetHeight;
        
        item.style.maxHeight = item.scrollHeight + 'px';
        
        setTimeout(() => {
            item.style.maxHeight = '';
            item.style.overflow = '';
            item.style.transition = '';
        }, 300);
    } else {
        item.style.maxHeight = item.scrollHeight + 'px';
        item.style.overflow = 'hidden';
        item.style.transition = 'max-height 0.3s ease-out';
        
        // Force reflow
        item.offsetHeight;
        
        item.style.maxHeight = '0px';
        
        setTimeout(() => {
            item.classList.add('hidden');
            item.style.maxHeight = '';
            item.style.overflow = '';
            item.style.transition = '';
        }, 300);
    }
    
    // Toggle icon rotation
    icon.classList.toggle('rotate-180');
}

/**
 * Navigate to section based on URL parameter
 */
function navigateToSection() {
    const urlParams = new URLSearchParams(window.location.search);
    const sectionId = urlParams.get('section');
    
    if (sectionId) {
        const section = document.getElementById(sectionId);
        if (section) {
            // Smooth scroll to section
            section.scrollIntoView({ 
                behavior: 'smooth', 
                block: 'start' 
            });
            
            // Add highlight effect
            section.classList.add('highlight-section');
            setTimeout(() => {
                section.classList.remove('highlight-section');
            }, 3000);
        }
    }
}

// Utility functions

/**
 * Show toast notification
 */
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    const toastId = generateId();
    
    const typeClasses = {
        success: 'bg-green-500 text-white',
        error: 'bg-red-500 text-white',
        warning: 'bg-yellow-500 text-black',
        info: 'bg-blue-500 text-white'
    };
    
    const icons = {
        success: 'fas fa-check-circle',
        error: 'fas fa-times-circle',
        warning: 'fas fa-exclamation-triangle',
        info: 'fas fa-info-circle'
    };
    
    toast.id = toastId;
    toast.className = `fixed top-4 right-4 ${typeClasses[type]} px-6 py-3 rounded-lg shadow-lg z-50 flex items-center space-x-2 transform translate-x-full transition-transform duration-300`;
    toast.innerHTML = `
        <i class="${icons[type]}"></i>
        <span>${message}</span>
        <button onclick="closeToast('${toastId}')" class="ml-2 opacity-70 hover:opacity-100">
            <i class="fas fa-times"></i>
        </button>
    `;
    
    document.body.appendChild(toast);
    
    // Animate in
    setTimeout(() => {
        toast.classList.remove('translate-x-full');
    }, 100);
    
    // Auto dismiss after 5 seconds
    setTimeout(() => {
        closeToast(toastId);
    }, 5000);
}

/**
 * Close toast notification
 */
function closeToast(toastId) {
    const toast = document.getElementById(toastId);
    if (!toast) return;
    
    toast.classList.add('translate-x-full');
    setTimeout(() => {
        if (toast.parentNode) {
            toast.parentNode.removeChild(toast);
        }
    }, 300);
}

/**
 * Close modal
 */
function closeModal(element) {
    const modal = element.closest('.fixed');
    if (modal) {
        document.body.removeChild(modal);
    }
}

/**
 * Copy text to clipboard
 */
function copyToClipboard(text) {
    navigator.clipboard.writeText(text).then(() => {
        showToast('Copied to clipboard!', 'success');
    }).catch(err => {
        console.error('Failed to copy: ', err);
        showToast('Failed to copy', 'error');
    });
}

/**
 * Share to Twitter
 */
function shareToTwitter(text, url) {
    window.open(`https://twitter.com/intent/tweet?text=${text}&url=${url}`, '_blank');
}

/**
 * Share to LinkedIn
 */
function shareToLinkedIn(text, url) {
    window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank');
}

// Add CSS for fullscreen code and section highlighting
const componentCSS = `
<style>
.fullscreen-code {
    position: fixed !important;
    top: 0 !important;
    left: 0 !important;
    width: 100vw !important;
    height: 100vh !important;
    z-index: 9999 !important;
    background: white !important;
    overflow: auto !important;
}

.dark .fullscreen-code {
    background: #1f2937 !important;
}

.fullscreen-code pre {
    max-height: none !important;
    height: calc(100vh - 120px) !important;
}

.highlight-section {
    animation: highlightPulse 3s ease-in-out;
    border: 2px solid #f97316;
    border-radius: 8px;
    box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
}

@keyframes highlightPulse {
    0% {
        box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
    }
    50% {
        box-shadow: 0 0 30px rgba(249, 115, 22, 0.6);
    }
    100% {
        box-shadow: 0 0 20px rgba(249, 115, 22, 0.3);
    }
}

@keyframes slideIn {
    from {
        opacity: 0;
        transform: translateY(-10px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.animate-slide-in {
    animation: slideIn 0.3s ease-out;
}

/* Smooth scroll behavior */
html {
    scroll-behavior: smooth;
}

/* Section anchor offset for fixed headers */
.component-container {
    scroll-margin-top: 80px;
}
</style>
`;

// Inject CSS
if (!document.getElementById('component-styles')) {
    const styleElement = document.createElement('div');
    styleElement.id = 'component-styles';
    styleElement.innerHTML = componentCSS;
    document.head.appendChild(styleElement);
}

// Export for global use
window.ComponentRenderers = ComponentRenderers;
window.renderComponent = renderComponent;
window.renderComponents = renderComponents;
window.generateSectionId = generateSectionId;
window.copyCodeToClipboard = copyCodeToClipboard;
window.downloadCodeFile = downloadCodeFile;
window.shareCode = shareCode;
window.shareSection = shareSection;
window.copyPageUrl = copyPageUrl;
window.toggleFullscreen = toggleFullscreen;
window.refreshPreview = refreshPreview;
window.dismissAlert = dismissAlert;
window.toggleAccordion = toggleAccordion;
window.navigateToSection = navigateToSection;
window.showToast = showToast;
window.closeToast = closeToast;
window.closeModal = closeModal;
window.copyToClipboard = copyToClipboard;
window.shareToTwitter = shareToTwitter;
window.shareToLinkedIn = shareToLinkedIn;

// Initialize on DOM load
document.addEventListener('DOMContentLoaded', () => {
    // Initialize syntax highlighting if Prism.js is available
    if (typeof Prism !== 'undefined') {
        Prism.highlightAll();
    }
    
    // Navigate to section if specified in URL
    navigateToSection();
});

// Handle browser back/forward navigation
window.addEventListener('popstate', () => {
    navigateToSection();
});
