import { useLocation } from 'react-router-dom';
import { categoriesData } from '../../api/categoriesApi';
import './nav.css';

function NavCategories() {
    const location = useLocation();
    let pathname = location.pathname;

    // Normalize to match Home slug
    const isHomePath = pathname === '/' || pathname === '/home';

    const renderCategoryLinks = (categories) =>
        categories.map((category) => {
            const isHomeCategory = category.slug === 'home';
            const targetPath = isHomeCategory ? '/' : `/${category.slug}`;
            const isActive = isHomeCategory ? isHomePath : pathname === targetPath;

            const Wrapper = isActive ? 'div' : 'a';
            const commonProps = {
                className: 'h-[34px] flex items-center relative pointer-events-auto group/category',
                ...(isActive ? {} : { href: targetPath }),
            };

            return (
                <Wrapper key={category.id} {...commonProps}>
                    <div className={`flex items-center justify-center w-[60px] px-2 ${isActive ? 'active-icon' : ''}`}>
                        <img
                            src={`/image/categories/${category.icon}`}
                            alt={category.name}
                            className="w-[22px] h-[34px]"
                        />
                        <div
                            className={`absolute left-[60px] h-full flex items-center font-[600] text-[15px] text-[#fff]
                            opacity-0 group-hover:opacity-100 transform translate-x-[-5px] group-hover:translate-x-0
                            transition-all duration-300 ease-out 
                            ${
                                isActive
                                    ? 'active'
                                    : 'group-hover/category:translate-x-[8px] group-hover/category:text-[rgba(255,255,255,0.7)]'
                            }
                            max-w-[120px] whitespace-nowrap`}
                        >
                            {category.name}
                        </div>
                    </div>
                </Wrapper>
            );
        });

    return (
        <nav
            className="flex flex-col w-[60px] h-[100vh] fixed left-0 top-[60px] border-r-[1px] border-solid border-[#28293d]
            bg-[#0c0d14] group transition-transform duration-300 transform scale-x-[1] origin-left hover:scale-x-100 z-[100]
            pt-[16px] overflow-hidden hover:overflow-y-auto will-change-transform hover:w-[200px]"
        >
            {renderCategoryLinks(categoriesData.mainNavigation)}
            <hr className="m-0 flex-shrink-0 border-0 border-solid border-white/12 border-b my-2 mx-4" />
            {renderCategoryLinks(categoriesData.categoriesGame)}
            <hr className="m-0 flex-shrink-0 border-0 border-solid border-white/12 border-b my-2 mx-4" />
            {renderCategoryLinks(categoriesData.footerNav)}
        </nav>
    );
}

export default NavCategories;
